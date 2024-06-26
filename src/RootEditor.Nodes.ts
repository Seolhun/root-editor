import type { Klass, LexicalNode } from 'lexical';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

import { AutocompleteNode } from './nodes/AutocompleteNode';
import { EmojiNode } from './nodes/EmojiNode';
import { EquationNode } from './nodes/EquationNode';
import { ExcalidrawNode } from './nodes/ExcalidrawNode';
import { FigmaNode } from './nodes/FigmaNode';
import { ImageNode } from './nodes/ImageNodes';
import { InlineImageNode } from './nodes/ImageNodes/InlineImageNode';
import { KeywordNode } from './nodes/KeywordNode';
import { LayoutContainerNode } from './nodes/LayoutContainerNode';
import { LayoutItemNode } from './nodes/LayoutItemNode';
import { MentionNode } from './nodes/MentionNode';
import { PageBreakNode } from './nodes/PageBreakNode/PageBreakNode';
import { PollNode } from './nodes/PollNode';
import { StickyNode } from './nodes/StickyNode';
import { TweetNode } from './nodes/TweetNode';
import { YouTubeNode } from './nodes/YouTubeNode';
import { CollapsibleContainerNode } from './plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleContentNode } from './plugins/CollapsiblePlugin/CollapsibleContentNode';
import { CollapsibleTitleNode } from './plugins/CollapsiblePlugin/CollapsibleTitleNode';

export const RootEditorNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  PollNode,
  StickyNode,
  ImageNode,
  InlineImageNode,
  MentionNode,
  EmojiNode,
  ExcalidrawNode,
  EquationNode,
  AutocompleteNode,
  KeywordNode,
  HorizontalRuleNode,
  TweetNode,
  YouTubeNode,
  FigmaNode,
  MarkNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  PageBreakNode,
  LayoutContainerNode,
  LayoutItemNode,
];
