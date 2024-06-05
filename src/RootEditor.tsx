import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import * as React from 'react';

import { Editor } from './Editor';
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

export interface BaseRootEditorProps {
  /**
   * Whether to enable debug mode.
   */
  debug?: boolean;
}

export const BaseRootEditor = React.forwardRef<ElementType, ElementProps & BaseRootEditorProps>(
  ({ debug, ...others }, ref) => {
    const {
      settings: { measureTypingPerf },
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
  },
);

export interface RootEditorProps extends BaseRootEditorProps {}

export const RootEditor = React.forwardRef<ElementType, ElementProps & RootEditorProps>(({ debug, ...others }, ref) => {
  return (
    <SettingsProvider>
      <BaseRootEditor debug={debug} ref={ref} {...others} />
    </SettingsProvider>
  );
});
