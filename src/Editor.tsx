import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
// Official Plugins
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { InitialEditorStateType, LexicalComposer } from '@lexical/react/LexicalComposer';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import clsx from 'clsx';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import React from 'react';

import { theme } from './Editor.theme';
import {
  AutoLinkPlugin,
  CodeHighlightPlugin,
  ContentEditable,
  EmojiNode,
  EmojiPlugin,
  ListMaxIndentLevelPlugin,
  Placeholder,
  ToolbarPlugin,
  TreeViewPlugin,
} from './plugins';
import { TableCellActionMenuPlugin } from './plugins/TablePlugin/TableCellActionMenuPlugin';
import { TableCellResizerPlugin } from './plugins/TablePlugin/TableCellResizer';
// Custom Plugins
import { TableContextProvider } from './plugins/TablePlugin/TablePlugin';

import './assets/index.scss';
import './assets/tailwind.scss';

type ElementType = HTMLDivElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export interface EditorProps {
  /**
   * Initial editor state
   */
  initialEditorState?: InitialEditorStateType;

  /**
   * 자동 저장
   */
  onSnapshot?: () => void;

  /**
   * onSubmit
   */
  onSubmit?: () => void;

  /**
   * Character Limit
   */
  placeholder?: string;

  /**
   * 자동저장 timeout ms
   */
  snapshotTimeout?: number;

  /**
   * @default Save
   */
  submitButtonLabel?: React.ReactNode;
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

const initialConfig = {
  namespace: 'Editor',
  nodes: [
    AutoLinkNode,
    LinkNode,
    ListNode,
    ListItemNode,
    TableCellNode,
    TableNode,
    TableRowNode,
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    // Custom Nodes
    EmojiNode,
  ],
  onError,
  theme,
};

const Editor = React.forwardRef<ElementType, EditorProps & ElementProps>(
  (
    {
      // HtmlProps
      className,
      initialEditorState,
      onSnapshot,
      onSubmit,
      placeholder = 'Write something you want',
      snapshotTimeout,
      submitButtonLabel,
      ...rests
    },
    ref,
  ): JSX.Element => {
    const [floatingAnchorElem, setFloatingAnchorElem] = React.useState(null);

    const onRef = (_floatingAnchorElem) => {
      if (_floatingAnchorElem !== null) {
        setFloatingAnchorElem(_floatingAnchorElem);
      }
    };

    return (
      <div {...rests} className={clsx('Root__Editor__Wrapper', className)} ref={ref}>
        <LexicalComposer initialConfig={initialConfig}>
          <TableContextProvider>
            <div className="editor-container">
              <ToolbarPlugin />
              <div className="editor-inner">
                <RichTextPlugin
                  contentEditable={
                    <div ref={onRef}>
                      <ContentEditable />
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                  placeholder={<Placeholder>{placeholder}</Placeholder>}
                />
                <AutoFocusPlugin />
                <AutoFocusPlugin />
                <AutoLinkPlugin />
                <CheckListPlugin />
                <ClearEditorPlugin />
                <CodeHighlightPlugin />
                <HistoryPlugin />
                <HistoryPlugin />
                <LinkPlugin />
                <ListPlugin />
                <ListPlugin />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                <OnChangePlugin onChange={onChange} />

                {/* Table */}
                <TablePlugin />
                <TableCellResizerPlugin />

                {/* Custom Plugins */}
                <AutoLinkPlugin />
                <CodeHighlightPlugin />
                <EmojiPlugin />
                <ListMaxIndentLevelPlugin maxDepth={7} />
                <TreeViewPlugin />
              </div>
            </div>
            <div className="editor-footer">
              {floatingAnchorElem && (
                <>
                  <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} />
                </>
              )}
            </div>
          </TableContextProvider>
        </LexicalComposer>
      </div>
    );
  },
);

export { Editor };
export default Editor;
