import type { BaseSelection, LexicalEditor, NodeKey } from 'lexical';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import useModal from '~/hooks/useModal';
import LinkPlugin from '~/plugins/LinkPlugin';
import { Button } from '~/ui/Button';
import ContentEditable from '~/ui/ContentEditable';
import { DialogActions } from '~/ui/Dialog';
import Placeholder from '~/ui/Placeholder';
import Select from '~/ui/Select';
import TextInput from '~/ui/TextInput';

import type { Position } from './InlineImageNode';

import { $isInlineImageNode, InlineImageNode } from './InlineImageNode';

import './InlineImageNode.scss';

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  className,
  altText,
  height,
  imageRef,
  position,
  src,
  width,
}: {
  altText: string;
  className: null | string;
  height: 'inherit' | number;
  imageRef: { current: HTMLImageElement | null };
  position: Position;
  src: string;
  width: 'inherit' | number;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      style={{
        display: 'block',
        height,
        width,
      }}
      alt={altText}
      className={className || undefined}
      data-position={position}
      draggable="false"
      ref={imageRef}
      src={src}
    />
  );
}

export function UpdateInlineImageDialog({
  activeEditor,
  nodeKey,
  onClose,
}: {
  activeEditor: LexicalEditor;
  nodeKey: NodeKey;
  onClose: () => void;
}): JSX.Element {
  const editorState = activeEditor.getEditorState();
  const node = editorState.read(() => $getNodeByKey(nodeKey) as InlineImageNode);
  const [altText, setAltText] = useState(node.getAltText());
  const [showCaption, setShowCaption] = useState(node.getShowCaption());
  const [position, setPosition] = useState<Position>(node.getPosition());

  const handleShowCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowCaption(e.target.checked);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value as Position);
  };

  const handleOnConfirm = () => {
    const payload = { altText, position, showCaption };
    if (node) {
      activeEditor.update(() => {
        node.update(payload);
      });
    }
    onClose();
  };

  return (
    <>
      <div style={{ marginBottom: '1em' }}>
        <TextInput
          data-test-id="image-modal-alt-text-input"
          label="Alt Text"
          onChange={setAltText}
          placeholder="Descriptive alternative text"
          value={altText}
        />
      </div>

      <Select
        id="position-select"
        label="Position"
        name="position"
        onChange={handlePositionChange}
        style={{ marginBottom: '1em', width: '208px' }}
        value={position}
      >
        <option value="left">Left</option>
        <option value="right">Right</option>
        <option value="full">Full Width</option>
      </Select>

      <div className="Input__wrapper">
        <input checked={showCaption} id="caption" onChange={handleShowCaptionChange} type="checkbox" />
        <label htmlFor="caption">Show Caption</label>
      </div>

      <DialogActions>
        <Button data-test-id="image-modal-file-upload-btn" onClick={() => handleOnConfirm()}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

export default function InlineImageComponent({
  altText,
  caption,
  height,
  nodeKey,
  position,
  showCaption,
  src,
  width,
}: {
  altText: string;
  caption: LexicalEditor;
  height: 'inherit' | number;
  nodeKey: NodeKey;
  position: Position;
  showCaption: boolean;
  src: string;
  width: 'inherit' | number;
}): JSX.Element {
  const [modal, showModal] = useModal();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isInlineImageNode(node)) {
          node.remove();
          return true;
        }
      }
      return false;
    },
    [isSelected, nodeKey],
  );

  const $onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (isSelected && $isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
        if (showCaption) {
          // Move focus into nested editor
          $setSelection(null);
          event.preventDefault();
          caption.focus();
          return true;
        } else if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [caption, isSelected, showCaption],
  );

  const $onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (activeEditorRef.current === caption || buttonRef.current === event.target) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [caption, editor, setSelected],
  );

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW),
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [clearSelection, editor, isSelected, nodeKey, $onDelete, $onEnter, $onEscape, setSelected]);

  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = isSelected;
  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          <button
            onClick={() => {
              showModal('Update Inline Image', (onClose) => (
                <UpdateInlineImageDialog activeEditor={editor} nodeKey={nodeKey} onClose={onClose} />
              ));
            }}
            className="image-edit-button"
            ref={buttonRef}
            type="button"
          >
            Edit
          </button>
          <LazyImage
            altText={altText}
            className={isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null}
            height={height}
            imageRef={imageRef}
            position={position}
            src={src}
            width={width}
          />
        </div>
        {showCaption && (
          <div className="image-caption-container">
            <LexicalNestedComposer initialEditor={caption}>
              <AutoFocusPlugin />
              <LinkPlugin />
              <RichTextPlugin
                contentEditable={<ContentEditable className="InlineImageNode__contentEditable" />}
                ErrorBoundary={LexicalErrorBoundary}
                placeholder={<Placeholder className="InlineImageNode__placeholder">Enter a caption...</Placeholder>}
              />
            </LexicalNestedComposer>
          </div>
        )}
      </>
      {modal}
    </Suspense>
  );
}
