import React from 'react';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import { InitialEditorStateType, LexicalComposer } from '@lexical/react/LexicalComposer';
import clsx from 'clsx';

// Official Plugins
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

// Custom Plugins
import { TableContextProvider } from './plugins/TablePlugin/TablePlugin';
import { TableCellResizerPlugin } from './plugins/TablePlugin/TableCellResizer';
import { TableCellActionMenuPlugin } from './plugins/TablePlugin/TableCellActionMenuPlugin';
import {
  AutoLinkPlugin,
  CodeHighlightPlugin,
  EmojiNode,
  EmojiPlugin,
  ListMaxIndentLevelPlugin,
  ToolbarPlugin,
  TreeViewPlugin,
  ContentEditable,
  Placeholder,
} from './plugins';
import { theme } from './Editor.theme';

import './assets/tailwind.scss';
import './assets/index.scss';

type ElementType = HTMLDivElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export interface EditorProps {
  /**
   * @default Save
   */
  submitButtonLabel?: React.ReactNode;

  /**
   * onSubmit
   */
  onSubmit?: () => void;

  /**
   * 자동 저장
   */
  onSnapshot?: () => void;

  /**
   * 자동저장 timeout ms
   */
  snapshotTimeout?: number;

  /**
   * Character Limit
   */
  placeholder?: string;

  /**
   * Initial editor state
   */
  initialEditorState?: InitialEditorStateType;
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
  theme,
  onError,
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
};

const Editor = React.forwardRef<ElementType, EditorProps & ElementProps>(
  (
    {
      submitButtonLabel,
      onSubmit,
      onSnapshot,
      snapshotTimeout,
      placeholder = 'Write something you want',
      initialEditorState,
      // HtmlProps
      className,
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
                  placeholder={<Placeholder>{placeholder}</Placeholder>}
                  ErrorBoundary={LexicalErrorBoundary}
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
