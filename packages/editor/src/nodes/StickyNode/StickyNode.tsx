import type {
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $setSelection, createEditor, DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';
import { createPortal } from 'react-dom';

import { NodeAttributeNames } from '../Node.AttributeNames';

const StickyComponent = React.lazy(() => import('./StickyComponent'));

type StickyNoteColor = 'pink' | 'yellow';

export type SerializedStickyNode = Spread<
  {
    caption: SerializedEditor;
    color: StickyNoteColor;
    xOffset: number;
    yOffset: number;
  },
  SerializedLexicalNode
>;

export class StickyNode extends DecoratorNode<JSX.Element> {
  __caption: LexicalEditor;
  __color: StickyNoteColor;
  __x: number;
  __y: number;

  constructor(x: number, y: number, color: 'pink' | 'yellow', caption?: LexicalEditor, key?: NodeKey) {
    super(key);
    this.__x = x;
    this.__y = y;
    this.__caption = caption || createEditor();
    this.__color = color;
  }

  static clone(node: StickyNode): StickyNode {
    return new StickyNode(node.__x, node.__y, node.__color, node.__caption, node.__key);
  }

  static getType(): string {
    return 'sticky';
  }

  static importJSON(serializedNode: SerializedStickyNode): StickyNode {
    const stickyNode = new StickyNode(serializedNode.xOffset, serializedNode.yOffset, serializedNode.color);
    const captionEditor = serializedNode.caption;
    const nestedEditor = stickyNode.__caption;
    const editorState = nestedEditor.parseEditorState(captionEditor.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return stickyNode;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  /**
   * @todo Don't use document.body to portal something in editor
   */
  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return createPortal(
      <Suspense fallback={null}>
        <StickyComponent
          caption={this.__caption}
          color={this.__color}
          nodeKey={this.getKey()}
          x={this.__x}
          y={this.__y}
        />
      </Suspense>,
      document.body,
    );
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute(NodeAttributeNames.__nodeKey, this.getKey());
    return { element };
  }

  exportJSON(): SerializedStickyNode {
    return {
      type: 'sticky',
      caption: this.__caption.toJSON(),
      color: this.__color,
      version: 1,
      xOffset: this.__x,
      yOffset: this.__y,
    };
  }

  isIsolated(): true {
    return true;
  }

  setPosition(x: number, y: number): void {
    const writable = this.getWritable();
    writable.__x = x;
    writable.__y = y;
    $setSelection(null);
  }

  toggleColor(): void {
    const writable = this.getWritable();
    writable.__color = writable.__color === 'pink' ? 'yellow' : 'pink';
  }

  updateDOM(): false {
    return false;
  }
}

export function $createStickyNode(xOffset: number, yOffset: number): StickyNode {
  return new StickyNode(xOffset, yOffset, 'yellow');
}

export function $isStickyNode(node: LexicalNode | null | undefined): node is StickyNode {
  return node instanceof StickyNode;
}
