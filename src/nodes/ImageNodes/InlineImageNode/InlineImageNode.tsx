import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, createEditor, DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

const InlineImageComponent = React.lazy(() => import('./InlineImageComponent'));

export type Position = 'full' | 'left' | 'right' | undefined;

export interface InlineImagePayload {
  altText: string;
  caption?: LexicalEditor;
  height?: number;
  key?: NodeKey;
  position?: Position;
  showCaption?: boolean;
  src: string;
  width?: number;
}

export interface UpdateInlineImagePayload {
  altText?: string;
  position?: Position;
  showCaption?: boolean;
}

function $convertInlineImageElement(domNode: Node): DOMConversionOutput | null {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, height, src, width } = domNode;
    const node = $createInlineImageNode({ altText, height, src, width });
    return { node };
  }
  return null;
}

export type SerializedInlineImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: number;
    position?: Position;
    showCaption: boolean;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

export class InlineImageNode extends DecoratorNode<JSX.Element> {
  __altText: string;
  __caption: LexicalEditor;
  __height: 'inherit' | number;
  __position: Position;
  __showCaption: boolean;
  __src: string;
  __width: 'inherit' | number;

  constructor(
    src: string,
    altText: string,
    position: Position,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__showCaption = showCaption || false;
    this.__caption = caption || createEditor();
    this.__position = position;
  }

  static clone(node: InlineImageNode): InlineImageNode {
    return new InlineImageNode(
      node.__src,
      node.__altText,
      node.__position,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key,
    );
  }

  static getType(): string {
    return 'inline-image';
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: $convertInlineImageElement,
        priority: 0,
      }),
    };
  }

  static importJSON(serializedNode: SerializedInlineImageNode): InlineImageNode {
    const { altText, caption, height, position, showCaption, src, width } = serializedNode;
    const node = $createInlineImageNode({
      altText,
      height,
      position,
      showCaption,
      src,
      width,
    });
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const className = `${config.theme.inlineImage} position-${this.__position}`;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <InlineImageComponent
          altText={this.__altText}
          caption={this.__caption}
          height={this.__height}
          nodeKey={this.getKey()}
          position={this.__position}
          showCaption={this.__showCaption}
          src={this.__src}
          width={this.__width}
        />
      </Suspense>
    );
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('width', this.__width.toString());
    element.setAttribute('height', this.__height.toString());
    return { element };
  }

  exportJSON(): SerializedInlineImageNode {
    return {
      type: 'inline-image',
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      position: this.__position,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  getAltText(): string {
    return this.__altText;
  }

  getPosition(): Position {
    return this.__position;
  }

  getShowCaption(): boolean {
    return this.__showCaption;
  }

  getSrc(): string {
    return this.__src;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setPosition(position: Position): void {
    const writable = this.getWritable();
    writable.__position = position;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  // View

  setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  update(payload: UpdateInlineImagePayload): void {
    const writable = this.getWritable();
    const { altText, position, showCaption } = payload;
    if (altText !== undefined) {
      writable.__altText = altText;
    }
    if (showCaption !== undefined) {
      writable.__showCaption = showCaption;
    }
    if (position !== undefined) {
      writable.__position = position;
    }
  }

  updateDOM(prevNode: InlineImageNode, dom: HTMLElement, config: EditorConfig): false {
    const position = this.__position;
    if (position !== prevNode.__position) {
      const className = `${config.theme.inlineImage} position-${position}`;
      if (className !== undefined) {
        dom.className = className;
      }
    }
    return false;
  }
}

export function $createInlineImageNode({
  key,
  altText,
  caption,
  height,
  position,
  showCaption,
  src,
  width,
}: InlineImagePayload): InlineImageNode {
  return $applyNodeReplacement(new InlineImageNode(src, altText, position, width, height, showCaption, caption, key));
}

export function $isInlineImageNode(node: LexicalNode | null | undefined): node is InlineImageNode {
  return node instanceof InlineImageNode;
}
