import { registerCodeHighlighting } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor } from 'lexical';
import React from 'react';

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
