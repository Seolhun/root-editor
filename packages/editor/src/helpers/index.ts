import { calculateZoomLevel } from '@lexical/utils';
import { $getRoot, LexicalEditor } from 'lexical';

import { Point } from '~/utils/point';
import { Rect } from '~/utils/rect';

const Downward = 1;
const Upward = -1;
const Indeterminate = 0;
let prevIndex = Infinity;

export function getTopLevelNodeKeys(editor: LexicalEditor): string[] {
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

export const getCurrentIndex = (() => {
  return (keysLength: number): number => {
    if (keysLength === 0) {
      return Infinity;
    }
    if (prevIndex >= 0 && prevIndex < keysLength) {
      return prevIndex;
    }

    return Math.floor(keysLength / 2);
  };
})();

export const getBlockElement = (() => {
  return (
    editor: LexicalEditor,
    event: MouseEvent,
    anchorElement: HTMLElement | null,
    useEdgeAsDefault = false,
  ): HTMLElement | null => {
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
            direction = Infinity;
          }
        }

        index += direction;
      }
    });

    return blockElem;
  };
})();
