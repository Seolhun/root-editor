import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import clsx from 'clsx';
import * as React from 'react';

import theme from './Editor.theme';
import { EditorInitialConfigType, EditorInitialSettings } from './Editor.types';
import { BaseRootEditor, BaseRootEditorProps } from './RootEditor';
import { RootEditorNodes } from './RootEditor.Nodes';
import { FloatingAreaProvider } from './context/floating';
import { I18nProvider, i18nProviderProps } from './context/i18n';
import { SettingsProvider } from './context/settings/SettingsContext';

/*eslint-disable */
import './assets/tailwind.scss';
import './RootEditor.scss';
/*eslint-enable */

type ElementType = HTMLElement;

export interface RootReadonlyEditorProps extends BaseRootEditorProps {
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
   * Resources for the i18n messages.
   */
  resources?: i18nProviderProps['resources'];
}

export const RootReadonlyEditor = React.forwardRef<ElementType, RootReadonlyEditorProps>(
  ({ className, initialConfigType, initialSettings, language = 'en', resources, ...others }, ref) => {
    const initialSettingValues = React.useMemo(() => {
      return {
        ...initialSettings,
        isRichText: false,
      };
    }, [initialSettings]);

    const initialConfig: InitialConfigType = {
      namespace: 'RootReadonlyEditor',
      nodes: [...RootEditorNodes],
      onError: (error: Error) => {
        throw error;
      },
      theme,
      ...initialConfigType,
      editable: false,
    };

    return (
      <section className={clsx('__RootEditor__', className)} ref={ref}>
        <FloatingAreaProvider>
          <LexicalComposer initialConfig={initialConfig}>
            <I18nProvider language={language} resources={resources}>
              <SettingsProvider initialSettings={initialSettingValues}>
                <BaseRootEditor {...others} />
              </SettingsProvider>
            </I18nProvider>
          </LexicalComposer>
        </FloatingAreaProvider>
      </section>
    );
  },
);
