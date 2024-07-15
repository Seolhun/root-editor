import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { eventFiles } from '@lexical/rich-text';
import { calculateZoomLevel, mergeRegister } from '@lexical/utils';
import clsx from 'clsx';
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  LexicalEditor,
} from 'lexical';
import { DragEvent as ReactDragEvent, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { EditorClasses } from '~/Editor.theme';
import { getBlockElement } from '~/helpers';
import { isHTMLElement } from '~/utils/guard';

const SPACE = 4;
const TARGET_LINE_HALF_HEIGHT = 2;
const DRAGGABLE_BLOCK_MENU_CLASSNAME = EditorClasses.draggableBlock;
const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block';
const TEXT_BOX_HORIZONTAL_PADDING = 28;

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
  const floatingElementRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElement.getBoundingClientRect();

  const lineHeight = Number.parseInt(targetStyle.lineHeight, 10);
  const floatingElementHeight = floatingElementRect.height;
  const top = targetRect.top + (lineHeight - floatingElementHeight) / 2 - anchorElementRect.top;
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

function useDraggableBlockMenu(editor: LexicalEditor, isEditable: boolean, floatingAnchor: HTMLElement) {
  const draggableMenuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const isDraggingBlockRef = useRef<boolean>(false);
  const [activeDraggableBlockElem, setActiveDraggableBlockElem] = useState<HTMLElement | null>(null);

  useEffect(() => {
    function onMouseOver(event: MouseEvent) {
      const target = event.target;
      if (!isHTMLElement(target)) {
        setActiveDraggableBlockElem(null);
        return;
      }

      if (isOnMenu(target)) {
        return;
      }

      const draggableBlockElement = getBlockElement(editor, event, floatingAnchor);
      setActiveDraggableBlockElem(draggableBlockElement);
    }

    function onMouseLeave() {
      setActiveDraggableBlockElem(null);
      draggableMenuRef.current?.classList.remove(EditorClasses.draggableBlockSelected);
    }

    const scrollerElement = floatingAnchor.parentElement;
    scrollerElement?.addEventListener('mouseover', onMouseOver);
    scrollerElement?.addEventListener('mouseleave', onMouseLeave);
    return () => {
      scrollerElement?.removeEventListener('mousemove', onMouseOver);
      scrollerElement?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [floatingAnchor, editor]);

  useEffect(() => {
    if (draggableMenuRef.current) {
      setMenuPosition(activeDraggableBlockElem, draggableMenuRef.current, floatingAnchor);
    }
  }, [floatingAnchor, activeDraggableBlockElem]);

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

      const targetBlockElement = getBlockElement(editor, event, floatingAnchor, true);
      const targetLineElement = targetLineRef.current;
      if (targetBlockElement === null || targetLineElement === null) {
        return false;
      }

      const mouseY = pageY / calculateZoomLevel(target);
      setTargetLine(targetLineElement, targetBlockElement, mouseY, floatingAnchor);
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

      const targetBlockElement = getBlockElement(editor, event, floatingAnchor, true);
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
  }, [editor, floatingAnchor]);

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

  return ReactDOM.createPortal(
    <>
      <div
        className={clsx(EditorClasses.draggableBlock)}
        draggable={true}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        ref={draggableMenuRef}
      >
        <div className={isEditable ? 'icon' : ''} />
      </div>
      <div className={EditorClasses.draggableBlockTargetLine} ref={targetLineRef} />
    </>,
    floatingAnchor,
  );
}

export interface DraggableBlockPluginProps {
  floatingAnchor: HTMLElement;
}

export function DraggableBlockPlugin({ floatingAnchor }: DraggableBlockPluginProps) {
  const [editor] = useLexicalComposerContext();

  return useDraggableBlockMenu(editor, editor._editable, floatingAnchor);
}
