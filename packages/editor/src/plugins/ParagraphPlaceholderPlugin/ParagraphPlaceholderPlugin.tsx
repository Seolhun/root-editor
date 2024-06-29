// ParagraphPlaceholderPlugin.tsx

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { $getRoot, $getSelection, $isParagraphNode, $isRangeSelection } from 'lexical';
import { useEffect, useRef } from 'react';

import { NodeAttributeNames } from '~/nodes/Node.AttributeNames';

export type ParagraphPlaceholderPluginProps = {
  hideOnEmptyEditor?: boolean;
  placeholder: string;
};

const tailwindPlaceholderClasses = [
  'before:float-left',
  'before:text-neutral',
  'before:dark:text-neutral',
  'before:pointer-events-none',
  'before:h-0',
  'before:content-[attr(data-root-placeholder)]',
];

export const ParagraphPlaceholderPlugin = ({ hideOnEmptyEditor, placeholder }: ParagraphPlaceholderPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const paragraphRef = useRef<HTMLElement | null>(null);
  const isEditable = useLexicalEditable();

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      if (!isEditable) return;

      editorState.read(() => {
        if (paragraphRef?.current) {
          paragraphRef.current.removeAttribute(NodeAttributeNames.placeholder);
          paragraphRef.current.classList.remove(...tailwindPlaceholderClasses);
          paragraphRef.current = null;
        }

        const nativeSelection = window.getSelection();
        const selection = $getSelection();
        const isRangeSelection = $isRangeSelection(selection);
        if (!nativeSelection || !selection || !isRangeSelection) return;

        if (hideOnEmptyEditor) {
          // Prevent from showing when editor is empty
          // Showing a placeholder in the first empty paragraph might conflict with the RichTextPlugin placeholder
          const textContentSize = $getRoot().getTextContentSize();
          const isEmptyEditor = textContentSize === 0;
          if (isEmptyEditor) return;
        }

        const parentNode = selection.anchor.getNode();
        if (!$isParagraphNode(parentNode) || !parentNode.isEmpty()) return;

        // It's a paragraph node, it's empty, and it's selected
        // Now switch over to the native selection to get the paragraph DOM element
        const paragraphDOMElement = nativeSelection.anchorNode;
        if (!paragraphDOMElement) return;

        if (paragraphDOMElement instanceof HTMLParagraphElement) {
          paragraphRef.current = paragraphDOMElement;
          paragraphRef.current.setAttribute(NodeAttributeNames.placeholder, placeholder);
          paragraphRef.current.classList.add(...tailwindPlaceholderClasses);
        }
      });
    });

    return () => {
      unregister();
    };
  }, [editor, hideOnEmptyEditor, isEditable, placeholder]);

  return null;
};
