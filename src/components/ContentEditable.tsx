import React from 'react';
import classNames from 'classnames';
import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';

type ElementProps = React.HTMLAttributes<HTMLDivElement>;
function ContentEditable({ className }: ElementProps): JSX.Element {
  return <LexicalContentEditable className={classNames('Root__Editor__ContentEditable', className)} />;
}

export { ContentEditable };
export default ContentEditable;
