import type { EditorThemeClasses } from 'lexical';

import { rootEditorTheme } from './RootEditorTheme';

import './StickyEditorTheme.css';

const theme: EditorThemeClasses = {
  ...rootEditorTheme,
  paragraph: 'StickyEditorTheme__paragraph',
};

export default theme;
