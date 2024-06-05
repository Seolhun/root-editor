import type { EditorThemeClasses } from 'lexical';

import { rootEditorTheme } from './RootEditorTheme';

import './CommentEditorTheme.css';

const theme: EditorThemeClasses = {
  ...rootEditorTheme,
  paragraph: 'CommentEditorTheme__paragraph',
};

export default theme;
