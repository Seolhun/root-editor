import React from 'react';
import classNames from 'classnames';
import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';

export type ContentEditableProps = React.HTMLAttributes<HTMLDivElement>;

function ContentEditable({ className }: ContentEditableProps): JSX.Element {
  return <LexicalContentEditable className={classNames('Root__Editor__ContentEditable', className)} />;
}

export { ContentEditable };
export default ContentEditable;
