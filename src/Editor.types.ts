import { EditorState, LexicalEditor } from 'lexical';

import { EditorSettings } from './Editor.settings';

export type EditorPlaceholderRenderer = (settings: EditorSettings) => string;

export type EditorOnChangeFn = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
