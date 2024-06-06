import type { EditorThemeClasses } from 'lexical';

import { rootEditorTheme } from './RootEditorTheme';

import './CommentEditorTheme.scss';

const theme: EditorThemeClasses = {
  ...rootEditorTheme,
  paragraph: 'CommentEditorTheme__paragraph',
};

export default theme;
