import React from 'react';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

function LexicalContentEditable({
  className,
}: {
  className?: string;
}): JSX.Element {
  return <ContentEditable className={className || 'ContentEditable__root'} />;
}

export { LexicalContentEditable };
export default LexicalContentEditable;
