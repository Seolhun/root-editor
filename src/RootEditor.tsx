import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import clsx from 'clsx';
import * as React from 'react';

import { Editor, EditorProps } from './Editor';
import { EditorInitialConfigType, EditorInitialSettings, EditorOnChangeFn } from './Editor.types';
import { RootEditorNodes } from './RootEditor.Nodes';
import { Settings } from './Settings';
import { FlashMessageContext } from './context/FlashMessageContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { FloatingAreaProvider } from './context/floating';
import { I18nProvider, i18nProviderProps } from './context/i18n';
import DocsPlugin from './plugins/DocsPlugin';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import { TableContext } from './plugins/TablePlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import { rootEditorTheme } from './themes/RootEditorTheme';

/*eslint-disable */
import '~/assets/tailwind.scss';
import './RootEditor.scss';
/*eslint-enable */

type ElementType = HTMLElement;

export interface RootEditorProps extends BaseRootEditorProps {
  /**
   * Additional class name for the root editor.
   */
  className?: string;
  /**
   * Initial configuration for the lexical composer.
   */
  initialConfigType?: EditorInitialConfigType;
  /**
   * Initial settings for the editor.
   */
  initialSettings?: EditorInitialSettings;
  /**
   * @default 'en'
   */
  language?: i18nProviderProps['language'];
  /**
   * Callback that is called when the editor state changes.
   */
  onChangeEditorState?: EditorOnChangeFn;
  /**
   * Resources for the i18n messages.
   */
  resources?: i18nProviderProps['resources'];
}

export const RootEditor = React.forwardRef<ElementType, RootEditorProps>(
  (
    { className, initialConfigType, initialSettings, language = 'en', onChangeEditorState, resources, ...others },
    ref,
  ) => {
    const initialConfig: InitialConfigType = {
      namespace: 'RootEditor',
      nodes: [...RootEditorNodes],
      onError: (error: Error) => {
        throw error;
      },
      theme: rootEditorTheme,
      ...initialConfigType,
    };

    return (
      <section className={clsx('__RootEditor__', className)} ref={ref}>
        <FloatingAreaProvider>
          <LexicalComposer initialConfig={initialConfig}>
            <I18nProvider language={language} resources={resources}>
              <SettingsProvider initialSettings={initialSettings}>
                <BaseRootEditor {...others} />
                {onChangeEditorState && <OnChangePlugin onChange={onChangeEditorState} />}
              </SettingsProvider>
            </I18nProvider>
          </LexicalComposer>
        </FloatingAreaProvider>
      </section>
    );
  },
);

export interface BaseRootEditorProps extends EditorProps {}

export const BaseRootEditor = ({ ...others }: BaseRootEditorProps) => {
  const { settings } = useSettings();
  const { debug, measureTypingPerf } = settings;

  return (
    <FlashMessageContext>
      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            <div className="editor-shell">
              <Editor {...others} />
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
