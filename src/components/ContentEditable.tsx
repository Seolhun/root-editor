import React from 'react';
import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';
import classNames from 'classnames';

type ElementProps = React.HTMLAttributes<HTMLDivElement>;
function ContentEditable({ className }: ElementProps): JSX.Element {
  return (
    <LexicalContentEditable
      className={classNames('Root__Editor__ContentEditable', className)}
    />
  );
}

export { ContentEditable };
export default ContentEditable;
