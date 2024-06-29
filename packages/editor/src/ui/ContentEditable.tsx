import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';
import clsx from 'clsx';
import * as React from 'react';

import { EditorClasses } from '~/Editor.theme';

import './ContentEditable.scss';

export function ContentEditable({ className }: { className?: string }): JSX.Element {
  return <LexicalContentEditable className={clsx(EditorClasses.contentEditable, className)} />;
}
