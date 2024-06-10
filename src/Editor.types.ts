import { InitialConfigType, InitialEditorStateType } from '@lexical/react/LexicalComposer';
import { EditorState, LexicalEditor, SerializedEditorState } from 'lexical';

import { EditorSettings } from './Editor.settings';

export type EditorPlaceholderRenderer = (settings: EditorSettings) => string;

export type EditorOnChangeFn = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;

export type EditorJson = SerializedEditorState;

export type EditorInitialConfigType = Pick<
  Partial<InitialConfigType>,
  'editable' | 'editorState' | 'html' | 'nodes' | 'onError' | 'theme'
>;

export type InitialEditorState = InitialEditorStateType;

export type EditorInitialSettings = Partial<EditorSettings>;
