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
          const textContentSize = $getRoot().getTextContentSize();
          const isEmptyEditor = textContentSize === 0;
          if (isEmptyEditor) return;
        }

        const parentNode = selection.anchor.getNode();
        if (!$isParagraphNode(parentNode) || !parentNode.isEmpty()) return;

        const paragraphDOMElement = nativeSelection.anchorNode;
        if (!paragraphDOMElement) return;

        const parentDOMElement = paragraphDOMElement.parentElement;
        if (!parentDOMElement) return;

        const isContentEditable = parentDOMElement.isContentEditable && parentDOMElement instanceof HTMLDivElement;
        const isParagraphElement = paragraphDOMElement instanceof HTMLParagraphElement;
        if (isParagraphElement && isContentEditable) {
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
