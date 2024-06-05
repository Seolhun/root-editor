import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import * as React from 'react';

import { Editor } from './Editor';
import { EditorSettings } from './Editor.settings';
import { RootEditorNodes } from './RootEditor.Nodes';
import { Settings } from './Settings';
import { FlashMessageContext } from './context/FlashMessageContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import DocsPlugin from './plugins/DocsPlugin';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import { TableContext } from './plugins/TablePlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import { rootEditorTheme } from './themes/RootEditorTheme';

import './index.css';

type ElementType = HTMLElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export interface RootEditorProps {
  /**
   * Initial settings for the editor.
   */
  initialSettings?: Partial<EditorSettings>;
}

export const RootEditor = React.forwardRef<ElementType, ElementProps & RootEditorProps>(
  ({ initialSettings, ...others }, ref) => {
    return (
      <SettingsProvider initialSettings={initialSettings}>
        <BaseRootEditor ref={ref} {...others} />
      </SettingsProvider>
    );
  },
);

export const BaseRootEditor = React.forwardRef<ElementType, ElementProps>(({ ...others }, ref) => {
  const {
    settings: { debug, measureTypingPerf },
  } = useSettings();

  const initialConfig: InitialConfigType = {
    namespace: 'RootEditor',
    nodes: [...RootEditorNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: rootEditorTheme,
  };

  return (
    <section ref={ref} {...others}>
      <LexicalComposer initialConfig={initialConfig}>
        <FlashMessageContext>
          <SharedHistoryContext>
            <TableContext>
              <SharedAutocompleteContext>
                <div className="editor-shell">
                  <Editor />
                </div>
                <Settings />
                {debug ? <DocsPlugin /> : null}
                {debug ? <PasteLogPlugin /> : null}
                {debug ? <TestRecorderPlugin /> : null}
                {measureTypingPerf ? <TypingPerfPlugin /> : null}
              </SharedAutocompleteContext>
            </TableContext>
          </SharedHistoryContext>
        </FlashMessageContext>
      </LexicalComposer>
    </section>
  );
});
