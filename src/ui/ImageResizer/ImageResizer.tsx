import type { LexicalEditor } from 'lexical';

import { calculateZoomLevel } from '@lexical/utils';
import clsx from 'clsx';
import * as React from 'react';
import { useRef } from 'react';

import { EditorClassNames } from '~/constants';

import './ImageResizer.scss';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const Direction = {
  east: 1 << 0,
  north: 1 << 3,
  south: 1 << 1,
  west: 1 << 2,
};

export interface ImageResizerProps {
  editor: LexicalEditor;
  imageRef: React.RefObject<HTMLElement>;
  maxWidth?: number;
  onResizeEnd: (width: 'inherit' | number, height: 'inherit' | number) => void;
  onResizeStart: () => void;
}

export interface ImageResizerPositioning {
  currentHeight: 'inherit' | number;
  currentWidth: 'inherit' | number;
  direction: number;
  isResizing: boolean;
  ratio: number;
  startHeight: number;
  startWidth: number;
  startX: number;
  startY: number;
}

function getDefaultSize(editorRootElement: HTMLElement | null) {
  return editorRootElement !== null ? editorRootElement.getBoundingClientRect().height - 20 : 100;
}

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;

export function ImageResizer({
  editor,
  imageRef,
  maxWidth,
  onResizeEnd,
  onResizeStart,
}: ImageResizerProps): JSX.Element {
  const controlWrapperRef = useRef<HTMLDivElement>(null);
  const userSelect = useRef({
    priority: '',
    value: 'default',
  });
  const positioningRef = useRef<ImageResizerPositioning>({
    currentHeight: 0,
    currentWidth: 0,
    direction: 0,
    isResizing: false,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startX: 0,
    startY: 0,
  });
  const editorRootElement = editor.getRootElement();
  // Find max width, accounting for editor padding.
  const maxWidthContainer = (() => {
    if (maxWidth) {
      return maxWidth;
    }
    return getDefaultSize(editorRootElement);
  })();
  const maxHeightContainer = getDefaultSize(editorRootElement);

  const setStartCursor = (direction: number) => {
    const ew = direction === Direction.east || direction === Direction.west;
    const ns = direction === Direction.north || direction === Direction.south;
    const nwse =
      (direction & Direction.north && direction & Direction.west) ||
      (direction & Direction.south && direction & Direction.east);

    const cursorDir = ew ? 'ew' : ns ? 'ns' : nwse ? 'nwse' : 'nesw';

    if (editorRootElement !== null) {
      editorRootElement.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
    }
    if (document.body !== null) {
      document.body.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
      userSelect.current.value = document.body.style.getPropertyValue('-webkit-user-select');
      userSelect.current.priority = document.body.style.getPropertyPriority('-webkit-user-select');
      document.body.style.setProperty('-webkit-user-select', `none`, 'important');
    }
  };

  const setEndCursor = () => {
    if (editorRootElement !== null) {
      editorRootElement.style.setProperty('cursor', 'text');
    }
    if (document.body !== null) {
      document.body.style.setProperty('cursor', 'default');
      document.body.style.setProperty('-webkit-user-select', userSelect.current.value, userSelect.current.priority);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, direction: number) => {
    if (!editor.isEditable()) {
      return;
    }

    const image = imageRef.current;
    const controlWrapper = controlWrapperRef.current;

    if (image !== null && controlWrapper !== null) {
      event.preventDefault();
      const { height, width } = image.getBoundingClientRect();
      const zoom = calculateZoomLevel(image);
      const positioning = positioningRef.current;
      positioning.startWidth = width;
      positioning.startHeight = height;
      positioning.ratio = width / height;
      positioning.currentWidth = width;
      positioning.currentHeight = height;
      positioning.startX = event.clientX / zoom;
      positioning.startY = event.clientY / zoom;
      positioning.isResizing = true;
      positioning.direction = direction;

      setStartCursor(direction);
      onResizeStart();

      controlWrapper.classList.add('ImageNode__Resizer--resizing');
      image.style.height = `${height}px`;
      image.style.width = `${width}px`;

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    const image = imageRef.current;
    const positioning = positioningRef.current;

    const isHorizontal = positioning.direction & (Direction.east | Direction.west);
    const isVertical = positioning.direction & (Direction.south | Direction.north);

    if (image !== null && positioning.isResizing) {
      const zoom = calculateZoomLevel(image);
      // Corner cursor
      if (isHorizontal && isVertical) {
        let diff = Math.floor(positioning.startX - event.clientX / zoom);
        diff = positioning.direction & Direction.east ? -diff : diff;

        const width = clamp(positioning.startWidth + diff, MIN_WIDTH, maxWidthContainer);
        const height = width / positioning.ratio;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        positioning.currentHeight = height;
        positioning.currentWidth = width;
      } else if (isVertical) {
        let diff = Math.floor(positioning.startY - event.clientY / zoom);
        diff = positioning.direction & Direction.south ? -diff : diff;

        const height = clamp(positioning.startHeight + diff, MIN_HEIGHT, maxHeightContainer);

        image.style.height = `${height}px`;
        positioning.currentHeight = height;
      } else {
        let diff = Math.floor(positioning.startX - event.clientX / zoom);
        diff = positioning.direction & Direction.east ? -diff : diff;

        const width = clamp(positioning.startWidth + diff, MIN_WIDTH, maxWidthContainer);

        image.style.width = `${width}px`;
        positioning.currentWidth = width;
      }
    }
  };

  const handlePointerUp = () => {
    const image = imageRef.current;
    const positioning = positioningRef.current;
    const controlWrapper = controlWrapperRef.current;
    if (image !== null && controlWrapper !== null && positioning.isResizing) {
      const width = positioning.currentWidth;
      const height = positioning.currentHeight;
      Object.assign<ImageResizerPositioning, ImageResizerPositioning>(positioning, {
        currentHeight: 0,
        currentWidth: 0,
        direction: 0,
        isResizing: false,
        ratio: 0,
        startHeight: 0,
        startWidth: 0,
        startX: 0,
        startY: 0,
      });

      controlWrapper.classList.remove('ImageNode__Resizer--resizing');

      setEndCursor();
      onResizeEnd(width, height);

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    }
  };

  return (
    <div ref={controlWrapperRef}>
      <div
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north);
        }}
        className={clsx(EditorClassNames.ImageResizer, 'Direction--n')}
      />
      <div
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north | Direction.east);
        }}
        className={clsx(EditorClassNames.ImageResizer, 'Direction--ne')}
      />
      <div
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.east);
        }}
        className={clsx(EditorClassNames.ImageResizer, 'Direction--e')}
      />
      <div
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south | Direction.east);
        }}
        className={clsx(EditorClassNames.ImageResizer, 'Direction--se')}
      />
      <div
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south);
        }}
        className={clsx(EditorClassNames.ImageResizer, 'Direction--s')}
      />
      <div
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south | Direction.west);
        }}
        className={clsx(EditorClassNames.ImageResizer, 'Direction--sw')}
      />
      <div
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.west);
        }}
        className={clsx(EditorClassNames.ImageResizer, 'Direction--w')}
      />
      <div
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north | Direction.west);
        }}
        className={clsx(EditorClassNames.ImageResizer, 'Direction--nw')}
      />
    </div>
  );
}
