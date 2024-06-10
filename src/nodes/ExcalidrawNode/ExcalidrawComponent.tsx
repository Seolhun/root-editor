import type { NodeKey } from 'lexical';

import { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';

import type { ExcalidrawInitialElements } from './ExcalidrawModal';

import ImageResizer from '../../ui/ImageResizer';
import ExcalidrawImage from './ExcalidrawImage';
import ExcalidrawModal from './ExcalidrawModal';
import { $isExcalidrawNode } from './index';

export default function ExcalidrawComponent({ data, nodeKey }: { data: string; nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setModalOpen] = useState<boolean>(data === '[]' && editor.isEditable());
  const imageContainerRef = useRef<HTMLImageElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const captionButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isExcalidrawNode(node)) {
            node.remove();
            return true;
          }
          return false;
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey],
  );

  // Set editor to readOnly if excalidraw is open to prevent unwanted changes
  useEffect(() => {
    if (isModalOpen) {
      editor.setEditable(false);
    } else {
      editor.setEditable(true);
    }
  }, [isModalOpen, editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const buttonElem = buttonRef.current;
          const eventTarget = event.target;

          if (isResizing) {
            return true;
          }

          if (buttonElem !== null && buttonElem.contains(eventTarget as Node)) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            if (event.detail > 1) {
              setModalOpen(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
    );
  }, [clearSelection, editor, isSelected, isResizing, onDelete, setSelected]);

  const deleteNode = useCallback(() => {
    setModalOpen(false);
    return editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isExcalidrawNode(node)) {
        node.remove();
      }
    });
  }, [editor, nodeKey]);

  const setData = (els: ExcalidrawInitialElements, aps: Partial<AppState>, fls: BinaryFiles) => {
    if (!editor.isEditable()) {
      return;
    }
    return editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isExcalidrawNode(node)) {
        if ((els && els.length > 0) || Object.keys(fls).length > 0) {
          node.setData(
            JSON.stringify({
              appState: aps,
              elements: els,
              files: fls,
            }),
          );
        } else {
          node.remove();
        }
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const onResizeEnd = (nextWidth: 'inherit' | number, nextHeight: 'inherit' | number) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);

      if ($isExcalidrawNode(node)) {
        node.setWidth(nextWidth);
        node.setHeight(nextHeight);
      }
    });
  };

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const { appState = {}, elements = [], files = {} } = useMemo(() => JSON.parse(data), [data]);

  return (
    <>
      <ExcalidrawModal
        onSave={(els, aps, fls) => {
          editor.setEditable(true);
          setData(els, aps, fls);
          setModalOpen(false);
        }}
        closeOnClickOutside={false}
        initialAppState={appState}
        initialElements={elements}
        initialFiles={files}
        isShown={isModalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={deleteNode}
      />
      {elements.length > 0 && (
        <button className={`excalidraw-button ${isSelected ? 'selected' : ''}`} ref={buttonRef} type="button">
          <ExcalidrawImage
            appState={appState}
            className="image"
            elements={elements}
            files={files}
            imageContainerRef={imageContainerRef}
          />
          {isSelected && (
            <div
              className="image-edit-button"
              onClick={openModal}
              onMouseDown={(event) => event.preventDefault()}
              role="button"
              tabIndex={0}
            />
          )}
          {(isSelected || isResizing) && (
            <ImageResizer
              buttonRef={captionButtonRef}
              captionsEnabled={true}
              editor={editor}
              imageRef={imageContainerRef}
              onResizeEnd={onResizeEnd}
              onResizeStart={onResizeStart}
              setShowCaption={() => null}
              showCaption={true}
            />
          )}
        </button>
      )}
    </>
  );
}
