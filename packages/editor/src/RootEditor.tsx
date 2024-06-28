import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import clsx from 'clsx';
import * as React from 'react';

import { Editor, EditorProps } from './Editor';
import { theme } from './Editor.theme';
import { EditorInitialConfigType, EditorInitialSettings, EditorOnChangeFn } from './Editor.types';
import { RootEditorNodes } from './RootEditor.Nodes';
import { Settings } from './Settings';
import { FlashMessageContext } from './context/FlashMessageContext';
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { I18nProvider, i18nProviderProps } from './context/i18n';
import { SettingsProvider, useSettings } from './context/settings/SettingsContext';
import DocsPlugin from './plugins/DocsPlugin';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import { TableContext } from './plugins/TablesPlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';

/*eslint-disable */
import '@seolhun/root-ui/dist/index.css';
import './RootEditor.scss';
import './assets/tailwind.scss';
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
      theme,
      ...initialConfigType,
    };

    return (
      <section className={clsx('__RootEditor__', className)} ref={ref}>
        <LexicalComposer initialConfig={initialConfig}>
          <I18nProvider language={language} resources={resources}>
            <SettingsProvider initialSettings={initialSettings}>
              <BaseRootEditor {...others} />
              {onChangeEditorState && <OnChangePlugin onChange={onChangeEditorState} />}
            </SettingsProvider>
          </I18nProvider>
        </LexicalComposer>
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
            <div className="RootEditorShell">
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
