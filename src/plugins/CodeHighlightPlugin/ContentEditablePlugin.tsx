import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import React from 'react';

function LexicalContentEditable({ className }: { className?: string }): JSX.Element {
  return <ContentEditable className={className || 'ContentEditable__root'} />;
}

export { LexicalContentEditable };
export default LexicalContentEditable;
