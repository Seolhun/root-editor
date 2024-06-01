import type { EditorThemeClasses } from 'lexical';

import baseTheme from './PlaygroundEditorTheme';

import './CommentEditorTheme.css';

const theme: EditorThemeClasses = {
  ...baseTheme,
  paragraph: 'CommentEditorTheme__paragraph',
};

export default theme;
