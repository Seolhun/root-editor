import { FloatingPortal } from '@floating-ui/react';
import { $isCodeHighlightNode } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import clsx from 'clsx';
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { EditorClasses } from '~/Editor.theme';
import { useFloatingAreaContext } from '~/components';
import { useSettings } from '~/context/settings';
import { getDOMRangeRect } from '~/utils/getDOMRangeRect';
import { getSelectedNode } from '~/utils/getSelectedNode';
import { setFloatingElemPosition } from '~/utils/setFloatingElemPosition';

import { INSERT_INLINE_COMMAND } from '../CommentPlugin';

import './FloatingTextFormatToolbarPlugin.scss';

export interface TextFormatFloatingToolbarProps {
  anchorElem: HTMLElement;
  editor: LexicalEditor;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isLink: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isUnderline: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}

function TextFormatFloatingToolbar({
  anchorElem,
  editor,
  isBold,
  isCode,
  isItalic,
  isLink,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  isUnderline,
  setIsLinkEditMode,
}: TextFormatFloatingToolbarProps): JSX.Element {
  const { settings } = useSettings();
  const { enabledCommentFeature } = settings;
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  const insertComment = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  function mouseMoveListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current && (e.buttons === 1 || e.buttons === 3)) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = 'none';
        }
      }
    }
  }
  function mouseUpListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
        popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
      };
    }
    return undefined;
  }, [popupCharStylesEditorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem, isLink);
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
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
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  return (
    <div className={clsx(EditorClasses.floatingTextFormatToolbar)} ref={popupCharStylesEditorRef}>
      {editor.isEditable() && (
        <>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            aria-label="Format text as bold"
            className={clsx('popup-item spaced', isBold && 'active')}
            type="button"
          >
            <i className="format bold" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            aria-label="Format text as italics"
            className={clsx('popup-item spaced', isItalic && 'active')}
            type="button"
          >
            <i className="format italic" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            aria-label="Format text to underlined"
            className={clsx('popup-item spaced', isUnderline && 'active')}
            type="button"
          >
            <i className="format underline" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
            aria-label="Format text with a strikethrough"
            className={clsx('popup-item spaced', isStrikethrough && 'active')}
            type="button"
          >
            <i className="format strikethrough" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
            }}
            aria-label="Format Subscript"
            className={clsx('popup-item spaced', isSubscript && 'active')}
            title="Subscript"
            type="button"
          >
            <i className="format subscript" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
            }}
            aria-label="Format Superscript"
            className={clsx('popup-item spaced', isSuperscript && 'active')}
            title="Superscript"
            type="button"
          >
            <i className="format superscript" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
            aria-label="Insert code block"
            className={clsx('popup-item spaced', isCode && 'active')}
            type="button"
          >
            <i className="format code" />
          </button>
          <button
            aria-label="Insert link"
            className={clsx('popup-item spaced', isLink && 'active')}
            onClick={insertLink}
            type="button"
          >
            <i className="format link" />
          </button>
        </>
      )}
      {enabledCommentFeature && (
        <button
          aria-label="Insert comment"
          className={'popup-item spaced insert-comment'}
          onClick={insertComment}
          type="button"
        >
          <i className="format add-comment" />
        </button>
      )}
    </div>
  );
}

function useFloatingTextFormatToolbar(editor: LexicalEditor, setIsLinkEditMode: Dispatch<boolean>) {
  const { floatingElement } = useFloatingAreaContext();
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) || rootElement === null || !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (!$isCodeHighlightNode(selection.anchor.getNode()) && selection.getTextContent() !== '') {
        setIsText($isTextNode(node) || $isParagraphNode(node));
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        const rootElement = editor.getRootElement();
        if (rootElement === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  if (!floatingElement) {
    return null;
  }

  return (
    <FloatingPortal root={floatingElement}>
      <TextFormatFloatingToolbar
        anchorElem={floatingElement}
        editor={editor}
        isBold={isBold}
        isCode={isCode}
        isItalic={isItalic}
        isLink={isLink}
        isStrikethrough={isStrikethrough}
        isSubscript={isSubscript}
        isSuperscript={isSuperscript}
        isUnderline={isUnderline}
        setIsLinkEditMode={setIsLinkEditMode}
      />
    </FloatingPortal>
  );
}

export interface FloatingTextFormatToolbarPluginProps {
  setIsLinkEditMode: Dispatch<boolean>;
}

export function FloatingTextFormatToolbarPlugin({ setIsLinkEditMode }: FloatingTextFormatToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();

  return useFloatingTextFormatToolbar(editor, setIsLinkEditMode);
}
