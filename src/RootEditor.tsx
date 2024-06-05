import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import clsx from 'clsx';
import { EditorState, LexicalEditor } from 'lexical';
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

export interface RootEditorProps {
  /**
   * Additional class name for the root editor.
   */
  className?: string;
  /**
   * Initial settings for the editor.
   */
  initialSettings?: Partial<EditorSettings>;
  /**
   * Callback that is called when the editor state changes.
   */
  onChangeEditorState?: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
}

export const RootEditor = React.forwardRef<ElementType, RootEditorProps>(
  ({ className, initialSettings, onChangeEditorState }, ref) => {
    const initialConfig: InitialConfigType = {
      namespace: 'RootEditor',
      nodes: [...RootEditorNodes],
      onError: (error: Error) => {
        throw error;
      },
      theme: rootEditorTheme,
    };

    return (
      <section className={clsx('RootEditor', className)} ref={ref}>
        <LexicalComposer initialConfig={initialConfig}>
          <SettingsProvider initialSettings={initialSettings}>
            <BaseRootEditor />
            {onChangeEditorState && <OnChangePlugin onChange={onChangeEditorState} />}
          </SettingsProvider>
        </LexicalComposer>
      </section>
    );
  },
);

export const BaseRootEditor = () => {
  const { settings } = useSettings();
  const { debug, measureTypingPerf } = settings;

  return (
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
  );
};
