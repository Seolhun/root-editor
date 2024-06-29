import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { $isHeadingNode } from '@lexical/rich-text';
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical';
import * as React from 'react';

import { NodeAttributeNames } from '~/nodes/Node.AttributeNames';

export type TitlePlaceholderPluginProps = {
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

export function TitlePlaceholderPlugin({ placeholder }: TitlePlaceholderPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const h1Ref = React.useRef<HTMLHeadingElement | null>(null);
  const isEditable = useLexicalEditable();

  React.useEffect(() => {
    if (!isEditable) return;

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        if (h1Ref?.current) {
          h1Ref.current.removeAttribute(NodeAttributeNames.placeholder);
          h1Ref.current.classList.remove(...tailwindPlaceholderClasses);
          h1Ref.current = null;
        }

        const nativeSelection = window.getSelection();
        const selection = $getSelection();
        const isRangeSelection = $isRangeSelection(selection);
        if (!nativeSelection || !selection || !isRangeSelection) return;

        // Prevent from showing when editor is empty
        // Showing a placeholder in the first empty heading might conflict with the RichTextPlugin placeholder
        const root = $getRoot();
        const textContentSize = root.getTextContentSize();
        const isEmptyEditor = textContentSize === 0;
        if (!isEmptyEditor) {
          return;
        }

        const parentNode = selection.anchor.getNode();
        if (!$isHeadingNode(parentNode) || !parentNode.isEmpty()) return;

        // It's a paragraph node, it's empty, and it's selected
        // Now switch over to the native selection to get the paragraph DOM element
        const element = nativeSelection.anchorNode;
        if (!element) return;

        if (element instanceof HTMLHeadingElement) {
          h1Ref.current = element;
          h1Ref.current.setAttribute(NodeAttributeNames.placeholder, placeholder);
          h1Ref.current.classList.add(...tailwindPlaceholderClasses);
        }
      });
    });

    return () => {
      unregister();
    };
  }, [editor, isEditable, placeholder]);

  return null;
}
