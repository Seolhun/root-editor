import { MarkdownShortcutPlugin as LexicalMarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import * as React from 'react';

import { ROOT_EDITOR_TRANSFORMERS } from '../MarkdownTransformers';

export function MarkdownShortcutPlugin(): JSX.Element {
  return <LexicalMarkdownShortcutPlugin transformers={ROOT_EDITOR_TRANSFORMERS} />;
}
