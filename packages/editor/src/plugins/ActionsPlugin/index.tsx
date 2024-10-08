import type { LexicalEditor } from 'lexical';

import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND, CLEAR_HISTORY_COMMAND } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from '~/context/settings';
import { useModal } from '~/hooks/useModal';
import { Button } from '~/ui/Button';
import { docFromHash } from '~/utils/docSerialization';

import { editorStateFromSerializedDocument, exportFile, importFile } from '../FilePlugin';
import { ROOT_EDITOR_TRANSFORMERS } from '../MarkdownTransformers';
import { SPEECH_TO_TEXT_COMMAND, SUPPORT_SPEECH_RECOGNITION } from '../SpeechToTextPlugin';

async function sendEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  try {
    await fetch('http://localhost:1235/setEditorState', {
      body: stringifiedEditorState,
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
    });
  } catch {
    // NO-OP
  }
}

async function validateEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  let response: any = null;
  try {
    response = await fetch('http://localhost:1235/validateEditorState', {
      body: stringifiedEditorState,
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
    });
  } catch {
    // NO-OP
  }
  if (response !== null && response.status === 403) {
    throw new Error('Editor state validation failed! Server did not accept changes.');
  }
}

export function ActionsPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const isEditable = editor.isEditable();
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [modal, showModal] = useModal();
  const { settings } = useSettings();
  const { isCollaborative } = settings;

  useEffect(() => {
    if (isCollaborative) {
      return;
    }
    docFromHash(window.location.hash).then((doc) => {
      if (doc && doc.source === 'RootEditor') {
        editor.setEditorState(editorStateFromSerializedDocument(editor, doc));
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      }
    });
  }, [editor, isCollaborative]);

  useEffect(() => {
    return editor.registerUpdateListener(({ dirtyElements, prevEditorState, tags }) => {
      // If we are in read only mode, send the editor state
      // to server and ask for validation if possible.
      if (!isEditable && dirtyElements.size > 0 && !tags.has('historic') && !tags.has('collaboration')) {
        validateEditorState(editor);
      }
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        if (children.length > 1) {
          setIsEditorEmpty(false);
        } else {
          if ($isParagraphNode(children[0])) {
            const paragraphChildren = children[0].getChildren();
            setIsEditorEmpty(paragraphChildren.length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        }
      });
    });
  }, [editor, isEditable]);

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(firstChild.getTextContent(), ROOT_EDITOR_TRANSFORMERS);
      } else {
        const markdown = $convertToMarkdownString(
          ROOT_EDITOR_TRANSFORMERS,
          undefined, //node
        );
        root.clear().append($createCodeNode('markdown').append($createTextNode(markdown)));
      }
      root.selectEnd();
    });
  }, [editor]);

  return (
    <div className="actions">
      {SUPPORT_SPEECH_RECOGNITION && (
        <button
          onClick={() => {
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
            setIsSpeechToText(!isSpeechToText);
          }}
          aria-label={`${isSpeechToText ? 'Enable' : 'Disable'} speech to text`}
          className={'action-button action-button-mic ' + (isSpeechToText ? 'active' : '')}
          title="Speech To Text"
          type="button"
        >
          <i className="mic" />
        </button>
      )}
      <button
        aria-label="Import editor state from JSON"
        className="action-button import"
        onClick={() => importFile(editor)}
        title="Import"
        type="button"
      >
        <i className="import" />
      </button>
      <button
        onClick={() =>
          exportFile(editor, {
            fileName: `RootEditor ${new Date().toISOString()}`,
            source: 'RootEditor',
          })
        }
        aria-label="Export editor state to JSON"
        className="action-button export"
        title="Export"
        type="button"
      >
        <i className="export" />
      </button>
      <button
        onClick={() => {
          showModal('Clear editor', (onClose) => <ShowClearDialog editor={editor} onClose={onClose} />);
        }}
        aria-label="Clear editor contents"
        className="action-button clear"
        disabled={isEditorEmpty}
        title="Clear"
        type="button"
      >
        <i className="clear" />
      </button>
      <button
        onClick={() => {
          // Send latest editor state to commenting validation server
          if (isEditable) {
            sendEditorState(editor);
          }
          editor.setEditable(!editor.isEditable());
        }}
        aria-label={`${!isEditable ? 'Unlock' : 'Lock'} read-only mode`}
        className={`action-button ${!isEditable ? 'unlock' : 'lock'}`}
        title="Read-Only Mode"
        type="button"
      >
        <i className={!isEditable ? 'unlock' : 'lock'} />
      </button>
      <button
        aria-label="Convert from markdown"
        className="action-button"
        onClick={handleMarkdownToggle}
        title="Convert From Markdown"
        type="button"
      >
        <i className="markdown" />
      </button>

      {modal}
    </div>
  );
}

function ShowClearDialog({ editor, onClose }: { editor: LexicalEditor; onClose: () => void }): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      {t('confirm.clear')}
      <div className="Modal__content">
        <Button
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            editor.focus();
            onClose();
          }}
        >
          {t('clear')}
        </Button>
        <Button
          onClick={() => {
            editor.focus();
            onClose();
          }}
        >
          {t('cancel')}
        </Button>
      </div>
    </>
  );
}
