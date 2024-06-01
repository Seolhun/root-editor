import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor, TextNode } from 'lexical';
import React from 'react';

import { $createEmojiNode } from './EmojiNode';

function emojiTransform(node: TextNode) {
  const textContent = node.getTextContent();

  /**
   * TODO: transform text to Emoji
   */
  if (textContent === ':avo:') {
    node.replace($createEmojiNode('avo-emoji', 'avo'));
  } else if (textContent === ':)') {
    node.replace($createEmojiNode('', '🙂'));
  }
}

function useEmojis(editor: LexicalEditor) {
  React.useEffect(() => {
    const removeTransform = editor.registerNodeTransform(TextNode, emojiTransform);
    return () => {
      removeTransform();
    };
  }, [editor]);
}

function EmojiPlugin() {
  const [editor] = useLexicalComposerContext();
  useEmojis(editor);
  return null;
}

export { EmojiPlugin };
export default EmojiPlugin;
