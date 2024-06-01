import React from 'react';
import clsx from 'clsx';
import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';

export type ContentEditableProps = React.HTMLAttributes<HTMLDivElement>;

function ContentEditable({ className }: ContentEditableProps): JSX.Element {
  return <LexicalContentEditable className={clsx('Root__Editor__ContentEditable', className)} />;
}

export { ContentEditable };
export default ContentEditable;
