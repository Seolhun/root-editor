/*eslint-disable */
import './assets/tailwind.scss';
import './RootEditor.scss';
/*eslint-enable */

import * as React from 'react';
import { I18nextProvider } from 'react-i18next';

import { Editor, EditorProps } from './Editor';
import { Settings } from './Settings';
import { FloatingAreaProvider } from './context/floating';
import { createI18n, i18nLanguage, i18nResource } from './context/i18n';
import {
  EditorPluginFunctionsContextProvider,
  EditorPluginFunctionsContextProviderProps,
} from './context/plugin-functions';
import { useSettings } from './context/settings';
import { SharedAutocompleteContext } from './context/shared-autocomplete';
import { SharedHistoryContext } from './context/shared-history';
import { DocsPlugin } from './plugins/DocsPlugin';
import { PasteLogPlugin } from './plugins/PasteLogPlugin';
import { TableContext } from './plugins/TablesPlugin';
import { TestRecorderPlugin } from './plugins/TestRecorderPlugin';
import { TypingPerfPlugin } from './plugins/TypingPerfPlugin';

type RootEditorExtension = Partial<EditorPluginFunctionsContextProviderProps>;
export interface BaseRootEditorProps extends EditorProps, RootEditorExtension {
  /**
   * @default 'en'
   */
  language?: i18nLanguage;
  /**
   * Resources for the i18n messages.
   */
  resources?: i18nResource;
}

export const BaseRootEditor = ({
  initialPluginFunctions,
  language = 'en',
  resources,
  ...others
}: BaseRootEditorProps) => {
  const { settings } = useSettings();
  const { debug, measureTypingPerf } = settings;

  const i18n = React.useMemo(() => {
    return createI18n(language, resources);
  }, [language, resources]);

  return (
    <I18nextProvider i18n={i18n}>
      <EditorPluginFunctionsContextProvider initialPluginFunctions={initialPluginFunctions}>
        <FloatingAreaProvider>
          <SharedHistoryContext>
            <TableContext>
              <SharedAutocompleteContext>
                <div className="RootEditorShell">
                  <Editor {...others} />
                </div>
                {debug ? <Settings /> : null}
                {debug ? <DocsPlugin /> : null}
                {debug ? <PasteLogPlugin /> : null}
                {debug ? <TestRecorderPlugin /> : null}
                {measureTypingPerf ? <TypingPerfPlugin /> : null}
              </SharedAutocompleteContext>
            </TableContext>
          </SharedHistoryContext>
        </FloatingAreaProvider>
      </EditorPluginFunctionsContextProvider>
    </I18nextProvider>
  );
};
