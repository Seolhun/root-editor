import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';
import clsx from 'clsx';
import React from 'react';

export type ContentEditableProps = React.HTMLAttributes<HTMLDivElement>;

function ContentEditable({ className }: ContentEditableProps): JSX.Element {
  return <LexicalContentEditable className={clsx('Root__Editor__ContentEditable', className)} />;
}

export { ContentEditable };
export default ContentEditable;
