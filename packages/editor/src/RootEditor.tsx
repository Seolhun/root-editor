import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import clsx from 'clsx';
import * as React from 'react';

import { BaseRootEditor, BaseRootEditorProps } from './BaseRootEditor';
import { theme } from './Editor.theme';
import { EditorInitialConfigType, EditorInitialSettings, EditorOnChangeFn } from './Editor.types';
import { RootEditorNodes } from './RootEditor.Nodes';
import { SettingsProvider } from './context/settings';
import { RootEditorTemplate, TEMPLATES } from './templates';

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
   * Callback that is called when the editor state changes.
   */
  onChangeEditorState?: EditorOnChangeFn;
  /**
   * Template for the root editor.
   */
  template?: RootEditorTemplate;
}

export const RootEditor = React.forwardRef<ElementType, RootEditorProps>(
  ({ className, initialConfigType, initialSettings, onChangeEditorState, template, ...others }, ref) => {
    const editorState = React.useMemo(() => {
      if (initialConfigType?.editorState) {
        return initialConfigType.editorState;
      }
      if (!template) {
        return undefined;
      }
      const templateEditorState = TEMPLATES[template];
      return JSON.stringify(templateEditorState);
    }, [initialConfigType?.editorState, template]);

    const initialConfig = React.useMemo<InitialConfigType>(() => {
      return {
        editorState,
        namespace: 'RootEditor',
        nodes: [...RootEditorNodes],
        onError: (error: Error) => {
          throw error;
        },
        theme,
        ...initialConfigType,
      };
    }, [editorState, initialConfigType]);

    return (
      <section className={clsx('__RootEditor__', className)} ref={ref}>
        <LexicalComposer initialConfig={initialConfig}>
          <SettingsProvider initialSettings={initialSettings}>
            <BaseRootEditor {...others} />
            {onChangeEditorState && <OnChangePlugin onChange={onChangeEditorState} />}
          </SettingsProvider>
        </LexicalComposer>
      </section>
    );
  },
);
