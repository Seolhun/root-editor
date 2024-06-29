import { FloatingPortal } from '@floating-ui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { eventFiles } from '@lexical/rich-text';
import { calculateZoomLevel, mergeRegister } from '@lexical/utils';
import clsx from 'clsx';
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  LexicalEditor,
} from 'lexical';
import { DragEvent as ReactDragEvent, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { EditorClasses } from '~/Editor.theme';
import { useFloatingAreaContext } from '~/context/floating';
import { isHTMLElement } from '~/utils/guard';
import { Point } from '~/utils/point';
import { Rect } from '~/utils/rect';

const SPACE = 4;
const TARGET_LINE_HALF_HEIGHT = 2;
const DRAGGABLE_BLOCK_MENU_CLASSNAME = EditorClasses.draggableBlock;
const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block';
const TEXT_BOX_HORIZONTAL_PADDING = 28;

const Downward = 1;
const Upward = -1;
const Indeterminate = 0;

let prevIndex = Infinity;

function getCurrentIndex(keysLength: number): number {
  if (keysLength === 0) {
    return Infinity;
  }
  if (prevIndex >= 0 && prevIndex < keysLength) {
    return prevIndex;
  }

  return Math.floor(keysLength / 2);
}

function getTopLevelNodeKeys(editor: LexicalEditor): string[] {
  return editor.getEditorState().read(() => $getRoot().getChildrenKeys());
}

function getCollapsedMargins(elem: HTMLElement): {
  marginBottom: number;
  marginTop: number;
} {
  const getMargin = (element: Element | null, margin: 'marginBottom' | 'marginTop'): number => {
    return element ? parseFloat(window.getComputedStyle(element)[margin]) : 0;
  };
  const { marginBottom, marginTop } = window.getComputedStyle(elem);
  const prevElemSiblingMarginBottom = getMargin(elem.previousElementSibling, 'marginBottom');
  const nextElemSiblingMarginTop = getMargin(elem.nextElementSibling, 'marginTop');
  const collapsedTopMargin = Math.max(parseFloat(marginTop), prevElemSiblingMarginBottom);
  const collapsedBottomMargin = Math.max(parseFloat(marginBottom), nextElemSiblingMarginTop);

  return { marginBottom: collapsedBottomMargin, marginTop: collapsedTopMargin };
}

function getBlockElement(
  editor: LexicalEditor,
  event: MouseEvent,
  anchorElement: HTMLElement | null,
  useEdgeAsDefault = false,
): HTMLElement | null {
  if (!anchorElement) {
    return null;
  }

  const anchorElementRect = anchorElement.getBoundingClientRect();
  const topLevelNodeKeys = getTopLevelNodeKeys(editor);

  let blockElem: HTMLElement | null = null;

  editor.getEditorState().read(() => {
    if (useEdgeAsDefault) {
      const [firstNode, lastNode] = [
        editor.getElementByKey(topLevelNodeKeys[0]),
        editor.getElementByKey(topLevelNodeKeys[topLevelNodeKeys.length - 1]),
      ];

      const [firstNodeRect, lastNodeRect] = [firstNode?.getBoundingClientRect(), lastNode?.getBoundingClientRect()];

      if (firstNodeRect && lastNodeRect) {
        const firstNodeZoom = calculateZoomLevel(firstNode);
        const lastNodeZoom = calculateZoomLevel(lastNode);
        if (event.y / firstNodeZoom < firstNodeRect.top) {
          blockElem = firstNode;
        } else if (event.y / lastNodeZoom > lastNodeRect.bottom) {
          blockElem = lastNode;
        }

        if (blockElem) {
          return;
        }
      }
    }

    let index = getCurrentIndex(topLevelNodeKeys.length);
    let direction = Indeterminate;

    while (index >= 0 && index < topLevelNodeKeys.length) {
      const key = topLevelNodeKeys[index];
      const elem = editor.getElementByKey(key);
      if (elem === null) {
        break;
      }
      const zoom = calculateZoomLevel(elem);
      const point = new Point(event.x / zoom, event.y / zoom);
      const domRect = Rect.fromDOM(elem);
      const { marginBottom, marginTop } = getCollapsedMargins(elem);
      const rect = domRect.generateNewRect({
        bottom: domRect.bottom + marginBottom,
        left: anchorElementRect.left,
        right: anchorElementRect.right,
        top: domRect.top - marginTop,
      });

      const {
        reason: { isOnBottomSide, isOnTopSide },
        result,
      } = rect.contains(point);

      if (result) {
        blockElem = elem;
        prevIndex = index;
        break;
      }

      if (direction === Indeterminate) {
        if (isOnTopSide) {
          direction = Upward;
        } else if (isOnBottomSide) {
          direction = Downward;
        } else {
          // stop search block element
          direction = Infinity;
        }
      }

      index += direction;
    }
  });

  return blockElem;
}

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

function setMenuPosition(targetElem: HTMLElement | null, floatingElem: HTMLElement, anchorElement: HTMLElement | null) {
  if (!targetElem || !anchorElement) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }

  const targetRect = targetElem.getBoundingClientRect();
  const targetStyle = window.getComputedStyle(targetElem);
  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElement.getBoundingClientRect();

  const top =
    targetRect.top + (parseInt(targetStyle.lineHeight, 10) - floatingElemRect.height) / 2 - anchorElementRect.top;

  const left = SPACE;

  floatingElem.style.opacity = '1';
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}

function setDragImage(dataTransfer: DataTransfer, draggableBlockElement: HTMLElement) {
  const { transform } = draggableBlockElement.style;

  // Remove dragImage borders
  draggableBlockElement.style.transform = 'translateZ(0)';
  dataTransfer.setDragImage(draggableBlockElement, 0, 0);

  requestAnimationFrame(() => {
    draggableBlockElement.style.transform = transform;
  });
}

function setTargetLine(
  targetLineElement: HTMLElement,
  targetBlockElement: HTMLElement,
  mouseY: number,
  anchorElement: HTMLElement | null,
) {
  if (!anchorElement) {
    return;
  }

  const { height: targetBlockElementHeight, top: targetBlockElementTop } = targetBlockElement.getBoundingClientRect();
  const { top: anchorTop, width: anchorWidth } = anchorElement.getBoundingClientRect();
  const { marginBottom, marginTop } = getCollapsedMargins(targetBlockElement);
  let lineTop = targetBlockElementTop;
  if (mouseY >= targetBlockElementTop) {
    lineTop += targetBlockElementHeight + marginBottom / 2;
  } else {
    lineTop -= marginTop / 2;
  }

  const top = lineTop - anchorTop - TARGET_LINE_HALF_HEIGHT;
  const left = TEXT_BOX_HORIZONTAL_PADDING - SPACE;

  targetLineElement.style.transform = `translate(${left}px, ${top}px)`;
  targetLineElement.style.width = `${anchorWidth - (TEXT_BOX_HORIZONTAL_PADDING - SPACE) * 2}px`;
  targetLineElement.style.opacity = '.4';
}

function hideTargetLine(targetLineElement: HTMLElement | null) {
  if (targetLineElement) {
    targetLineElement.style.opacity = '0';
    targetLineElement.style.transform = 'translate(-10000px, -10000px)';
  }
}

function useDraggableBlockMenu(editor: LexicalEditor, isEditable: boolean) {
  const { floatingElement } = useFloatingAreaContext();
  const scrollerElement = floatingElement?.parentElement;

  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const isDraggingBlockRef = useRef<boolean>(false);
  const [activeDraggableBlockElem, setActiveDraggableBlockElem] = useState<HTMLElement | null>(null);

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      const target = event.target;
      if (!isHTMLElement(target)) {
        setActiveDraggableBlockElem(null);
        return;
      }

      if (isOnMenu(target)) {
        return;
      }

      const draggableBlockElement = getBlockElement(editor, event, floatingElement);
      setActiveDraggableBlockElem(draggableBlockElement);
    }

    function onMouseLeave() {
      setActiveDraggableBlockElem(null);
    }

    scrollerElement?.addEventListener('mousemove', onMouseMove);
    scrollerElement?.addEventListener('mouseleave', onMouseLeave);
    return () => {
      scrollerElement?.removeEventListener('mousemove', onMouseMove);
      scrollerElement?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [scrollerElement, floatingElement, editor]);

  useEffect(() => {
    if (menuRef.current) {
      setMenuPosition(activeDraggableBlockElem, menuRef.current, floatingElement);
    }
  }, [floatingElement, activeDraggableBlockElem]);

  useEffect(() => {
    function onDragover(event: DragEvent): boolean {
      if (!isDraggingBlockRef.current) {
        return false;
      }

      const [isFileTransfer] = eventFiles(event);
      if (isFileTransfer) {
        return false;
      }

      const { pageY, target } = event;
      if (!isHTMLElement(target)) {
        return false;
      }

      const targetBlockElement = getBlockElement(editor, event, floatingElement, true);
      const targetLineElement = targetLineRef.current;
      if (targetBlockElement === null || targetLineElement === null) {
        return false;
      }

      const mouseY = pageY / calculateZoomLevel(target);
      setTargetLine(targetLineElement, targetBlockElement, mouseY, floatingElement);
      // Prevent default event to be able to trigger onDrop events
      event.preventDefault();
      return true;
    }

    function $onDrop(event: DragEvent): boolean {
      if (!isDraggingBlockRef.current) {
        return false;
      }

      const [isFileTransfer] = eventFiles(event);
      if (isFileTransfer) {
        return false;
      }

      const { dataTransfer, pageY, target } = event;
      const dragData = dataTransfer?.getData(DRAG_DATA_FORMAT) || '';
      const draggedNode = $getNodeByKey(dragData);
      if (!draggedNode) {
        return false;
      }

      if (!isHTMLElement(target)) {
        return false;
      }

      const targetBlockElement = getBlockElement(editor, event, floatingElement, true);
      if (!targetBlockElement) {
        return false;
      }

      const targetNode = $getNearestNodeFromDOMNode(targetBlockElement);
      if (!targetNode) {
        return false;
      }

      if (targetNode === draggedNode) {
        return true;
      }

      const targetBlockElementTop = targetBlockElement.getBoundingClientRect().top;
      if (pageY / calculateZoomLevel(target) >= targetBlockElementTop) {
        targetNode.insertAfter(draggedNode);
      } else {
        targetNode.insertBefore(draggedNode);
      }

      setActiveDraggableBlockElem(null);
      return true;
    }

    return mergeRegister(
      editor.registerCommand(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event);
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, floatingElement]);

  function onDragStart(event: ReactDragEvent<HTMLDivElement>): void {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer || !activeDraggableBlockElem) {
      return;
    }
    setDragImage(dataTransfer, activeDraggableBlockElem);
    let nodeKey = '';
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(activeDraggableBlockElem);
      if (node) {
        nodeKey = node.getKey();
      }
    });
    isDraggingBlockRef.current = true;
    dataTransfer.setData(DRAG_DATA_FORMAT, nodeKey);
  }

  function onDragEnd(): void {
    isDraggingBlockRef.current = false;
    hideTargetLine(targetLineRef.current);
  }

  if (!floatingElement) {
    return null;
  }

  return (
    <FloatingPortal root={floatingElement}>
      <div
        className={clsx('icon', EditorClasses.draggableBlock)}
        draggable={true}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        ref={menuRef}
      >
        <div className={isEditable ? 'icon' : ''} />
      </div>
      <div className={EditorClasses.draggableBlockTargetLine} ref={targetLineRef} />
    </FloatingPortal>
  );
}

export function DraggableBlockPlugin() {
  const [editor] = useLexicalComposerContext();

  return useDraggableBlockMenu(editor, editor._editable);
}
