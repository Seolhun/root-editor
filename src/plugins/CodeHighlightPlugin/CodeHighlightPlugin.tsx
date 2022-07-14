import React from 'react';
import { LexicalEditor } from 'lexical';
import { registerCodeHighlighting } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function useCodeHighlight(editor: LexicalEditor) {
  React.useEffect(() => {
    return () => {
      registerCodeHighlighting(editor);
    };
  }, [editor]);
}

function CodeHighlightPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useCodeHighlight(editor);
  return null;
}

export { CodeHighlightPlugin };
export default CodeHighlightPlugin;
