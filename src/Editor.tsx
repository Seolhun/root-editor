import React from 'react';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import {
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import classNames from 'classnames';
// Plugins
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoScrollPlugin } from '@lexical/react/LexicalAutoScrollPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
// Nodes
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import {
  AutoLinkPlugin,
  CodeHighlightPlugin,
  EmojiNode,
  EmojiPlugin,
  ListMaxIndentLevelPlugin,
  ToolbarPlugin,
  TreeViewPlugin,
} from './plugins';
import { ContentEditable, Placeholder } from './components';
import { theme } from './Editor.theme';

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

type HtmlElementProps = React.HTMLAttributes<HTMLDivElement>;
const Editor = ({
  submitButtonLabel,
  onSubmit,
  onSnapshot,
  snapshotTimeout,
  placeholder = 'Write something you want',
  initialEditorState,
  // HtmlProps
  className,
  ...rests
}: EditorProps & HtmlElementProps): JSX.Element => {
  const editorScrollRef = React.useRef<HTMLDivElement>(null);
  return (
    <div className={classNames('Root__Editor__Wrapper', className)} {...rests}>
      <LexicalComposer
        initialConfig={{
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
        }}
      >
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              initialEditorState={initialEditorState}
              contentEditable={<ContentEditable />}
              placeholder={<Placeholder>{placeholder}</Placeholder>}
            />

            <AutoFocusPlugin />
            <AutoFocusPlugin />
            <AutoLinkPlugin />
            <AutoScrollPlugin scrollRef={editorScrollRef} />
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
            <TablePlugin />

            {/* Custom Plugins */}
            <AutoLinkPlugin />
            <CodeHighlightPlugin />
            <EmojiPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TreeViewPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};

export { Editor };
export default Editor;
