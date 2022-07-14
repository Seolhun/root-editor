import React from 'react';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import {
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
// Plugins
import { AutoFocusPlugin as LexicalAutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoScrollPlugin as LexicalAutoScrollPlugin } from '@lexical/react/LexicalAutoScrollPlugin';
import { CheckListPlugin as LexicalCheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin as LexicalClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { HistoryPlugin as LexicalHistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin as LexicalListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin as LexicalOnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin as LexicalRichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';
// Nodes
import {
  TableNode as LexicalTableNode,
  TableCellNode as LexicalTableCellNode,
  TableRowNode as LexicalTableRowNode,
} from '@lexical/table';
import {
  LinkNode as LexicalLinkNode,
  AutoLinkNode as LexicalAutoLinkNode,
} from '@lexical/link';
import {
  ListNode as LexicalListNode,
  ListItemNode as LexicalListItemNode,
} from '@lexical/list';

import {
  EmojiNode,
  EmojiPlugin,
  AutoLinkPlugin,
  CodeHighlightPlugin,
  ToolbarPlugin,
} from './plugins';
import { ContentEditable, Placeholder } from './components';
import { theme } from './Editor.theme';
import classNames from 'classnames';

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
            LexicalAutoLinkNode,
            LexicalLinkNode,
            LexicalListNode,
            LexicalListItemNode,
            LexicalTableCellNode,
            LexicalTableNode,
            LexicalTableRowNode,
            // Custom Nodes
            EmojiNode,
          ],
        }}
      >
        <LexicalAutoFocusPlugin />
        <LexicalAutoScrollPlugin scrollRef={editorScrollRef} />
        <LexicalCheckListPlugin />
        <LexicalClearEditorPlugin />
        <LexicalHistoryPlugin />
        <LexicalListPlugin />
        <LexicalOnChangePlugin onChange={onChange} />
        <LexicalTablePlugin />

        {/* Custom Plugins */}
        <AutoLinkPlugin />
        <CodeHighlightPlugin />
        <EmojiPlugin />

        <ToolbarPlugin />
        <LexicalRichTextPlugin
          initialEditorState={initialEditorState}
          contentEditable={<ContentEditable />}
          placeholder={<Placeholder>{placeholder}</Placeholder>}
        />
      </LexicalComposer>
    </div>
  );
};

export { Editor };
export default Editor;
