import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import clsx from 'clsx';
import * as React from 'react';

import { BaseRootEditor, BaseRootEditorProps } from './BaseRootEditor';
import { theme } from './Editor.theme';
import { EditorInitialConfigType, EditorInitialSettings } from './Editor.types';
import { RootEditorNodes } from './RootEditor.Nodes';
import { SettingsProvider } from './context/settings';

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
}

export const RootReadonlyEditor = React.forwardRef<ElementType, RootReadonlyEditorProps>(
  ({ className, initialConfigType, initialSettings, ...others }, ref) => {
    const initialSettingValues = React.useMemo(() => {
      return {
        ...initialSettings,
        isRichText: false,
      };
    }, [initialSettings]);

    const initialConfig = React.useMemo<InitialConfigType>(() => {
      return {
        editable: false,
        namespace: 'RootReadonlyEditor',
        nodes: [...RootEditorNodes],
        onError: (error: Error) => {
          throw error;
        },
        theme,
        ...initialConfigType,
      };
    }, [initialConfigType]);

    return (
      <section className={clsx('__RootEditor__', className)} ref={ref}>
        <LexicalComposer initialConfig={initialConfig}>
          <SettingsProvider initialSettings={initialSettingValues}>
            <BaseRootEditor {...others} />
          </SettingsProvider>
        </LexicalComposer>
      </section>
    );
  },
);
