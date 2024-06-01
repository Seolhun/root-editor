import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import * as React from 'react';

import { Editor } from './Editor';
import Settings from './Settings';
import { isDevPlayground } from './appSettings';
import { FlashMessageContext } from './context/FlashMessageContext';
import { useSettings } from './context/SettingsContext';
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import DocsPlugin from './plugins/DocsPlugin';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import { TableContext } from './plugins/TablePlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

import './index.css';

export function RootEditor() {
  const {
    settings: { measureTypingPerf },
  } = useSettings();

  const initialConfig: InitialConfigType = {
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <FlashMessageContext>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div className="editor-shell">
                <Editor />
              </div>
              <Settings />
              {isDevPlayground ? <DocsPlugin /> : null}
              {isDevPlayground ? <PasteLogPlugin /> : null}
              {isDevPlayground ? <TestRecorderPlugin /> : null}
              {measureTypingPerf ? <TypingPerfPlugin /> : null}
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </FlashMessageContext>
    </LexicalComposer>
  );
}
