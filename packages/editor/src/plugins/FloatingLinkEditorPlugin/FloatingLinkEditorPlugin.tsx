import { filter, find, pipe } from '@fxts/core';
import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { $createLinkNode, $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import clsx from 'clsx';
import {
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import * as React from 'react';
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { EditorClasses } from '~/Editor.theme';
import { useFloatingAreaContext } from '~/components';
import { useClientReady } from '~/hooks/useClientReady';
import { getSelectedNode } from '~/utils/getSelectedNode';
import { setFloatingElemPositionForLinkEditor } from '~/utils/setFloatingElemPositionForLinkEditor';
import { sanitizeUrl } from '~/utils/url';

import './FloatingLinkEditorPlugin.scss';

export interface FloatingLinkEditorProps {
  editor: LexicalEditor;
  isLink: boolean;
  isLinkEditMode: boolean;
  setIsLink: Dispatch<boolean>;
  setIsLinkEditMode: Dispatch<boolean>;
}

const linkIcon = clsx('size-10', 'mt-2', 'cursor-pointer');

function FloatingLinkEditor({
  editor,
  isLink,
  isLinkEditMode,
  setIsLink,
  setIsLinkEditMode,
}: FloatingLinkEditorProps): JSX.Element {
  const { floatingElement } = useFloatingAreaContext();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://');
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null);

  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        setLinkUrl(linkParent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl);
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null || !floatingElement) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined = nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      if (domRect) {
        domRect.y += 40;
        setFloatingElemPositionForLinkEditor(domRect, editorElem, floatingElement);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, floatingElement);
      }
      setLastSelection(null);
      setIsLinkEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [floatingElement, editor, setIsLinkEditMode, isLinkEditMode, linkUrl]);

  const $revertLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);
      if (linkParent) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      }
    }
  }, [editor]);

  useEffect(() => {
    const scrollerElem = floatingElement?.parentElement;
    const update = () => {
      editor.getEditorState().read(() => {
        $updateLinkEditor();
      });
    };
    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }
    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [floatingElement, editor, $updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, $updateLinkEditor, setIsLink, isLink, $revertLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor();
    });
  }, [editor, $updateLinkEditor]);

  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLinkEditMode, isLink]);

  const monitorInputInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLinkSubmission();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsLinkEditMode(false);
    }
  };

  const handleLinkSubmission = () => {
    if (lastSelection !== null) {
      if (linkUrl !== '') {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl));
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent();
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title,
              });
              parent.replace(linkNode, true);
            }
          }
        });
      }
      setEditedLinkUrl('https://');
      setIsLinkEditMode(false);
    }
  };

  return (
    <div className={clsx(EditorClasses.linkEditor)} ref={editorRef}>
      {!isLink ? null : isLinkEditMode ? (
        <>
          <input
            onChange={(event) => {
              setEditedLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              monitorInputInteraction(event);
            }}
            className="link-input"
            ref={inputRef}
            value={editedLinkUrl}
          />
          <div className={clsx('flex items-center', 'space-x-2')}>
            <XCircleIcon
              onClick={() => {
                setIsLinkEditMode(false);
              }}
              className={clsx('link-cancel', linkIcon, 'text-neutral dark:text-neutral')}
              onMouseDown={(event) => event.preventDefault()}
              role="button"
              tabIndex={0}
            />

            <CheckCircleIcon
              className={clsx('link-confirm', linkIcon, 'text-neutral dark:text-neutral')}
              onClick={handleLinkSubmission}
              onMouseDown={(event) => event.preventDefault()}
              role="button"
              tabIndex={0}
            />
          </div>
        </>
      ) : (
        <div className={clsx('link-view')}>
          <a href={sanitizeUrl(linkUrl)} rel="noopener noreferrer" target="_blank">
            {linkUrl}
          </a>
          <div className={clsx('flex items-center', 'space-x-2')}>
            <PencilIcon
              onClick={() => {
                setEditedLinkUrl(linkUrl);
                setIsLinkEditMode(true);
              }}
              className={clsx('link-edit', linkIcon, 'text-neutral dark:text-neutral')}
              onMouseDown={(event) => event.preventDefault()}
              role="button"
              tabIndex={0}
            />
            <TrashIcon
              onClick={() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
              }}
              className={clsx('link-trash', linkIcon, 'text-neutral dark:text-neutral')}
              onMouseDown={(event) => event.preventDefault()}
              role="button"
              tabIndex={0}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  isLinkEditMode: boolean,
  setIsLinkEditMode: Dispatch<boolean>,
  anchorElem?: HTMLElement,
): JSX.Element | null {
  const { floatingElement } = useFloatingAreaContext();
  const isClientReady = useClientReady();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    function $updateToolbar() {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection);
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode);
        const focusAutoLinkNode = $findMatchingParent(focusNode, $isAutoLinkNode);
        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false);
          return;
        }
        const badNode = pipe(
          selection.getNodes(),
          filter((node) => !$isLineBreakNode(node)),
          find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode);
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode && !autoLinkNode.is(focusAutoLinkNode))
            );
          }),
        );
        if (badNode) {
          setIsLink(false);
        } else {
          setIsLink(true);
        }
      }
    }
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank');
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  if (!isClientReady || !floatingElement) {
    return null;
  }

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      isLinkEditMode={isLinkEditMode}
      setIsLink={setIsLink}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    floatingElement,
  );
}

export interface FloatingLinkEditorToolbarProps {
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}

export default function FloatingLinkEditorPlugin({
  isLinkEditMode,
  setIsLinkEditMode,
}: FloatingLinkEditorToolbarProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingLinkEditorToolbar(editor, isLinkEditMode, setIsLinkEditMode);
}
