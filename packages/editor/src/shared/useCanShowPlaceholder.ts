import type { LexicalEditor } from 'lexical';

import { $canShowPlaceholderCurry } from '@lexical/text';
import { mergeRegister } from '@lexical/utils';
import { useState } from 'react';

import useLayoutEffect from './useLayoutEffect';

function canShowPlaceholderFromCurrentEditorState(editor: LexicalEditor): boolean {
  const currentCanShowPlaceholder = editor.getEditorState().read($canShowPlaceholderCurry(editor.isComposing()));

  return currentCanShowPlaceholder;
}

export function useCanShowPlaceholder(editor: LexicalEditor): boolean {
  const [canShowPlaceholder, setCanShowPlaceholder] = useState(() => canShowPlaceholderFromCurrentEditorState(editor));

  useLayoutEffect(() => {
    function resetCanShowPlaceholder() {
      const currentCanShowPlaceholder = canShowPlaceholderFromCurrentEditorState(editor);
      setCanShowPlaceholder(currentCanShowPlaceholder);
    }
    resetCanShowPlaceholder();
    return mergeRegister(
      editor.registerUpdateListener(() => {
        resetCanShowPlaceholder();
      }),
      editor.registerEditableListener(() => {
        resetCanShowPlaceholder();
      }),
    );
  }, [editor]);

  return canShowPlaceholder;
}
