import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { DecoratorNode } from 'lexical';
import { Suspense } from 'react';
import * as React from 'react';

import { NodeAttributeNames } from '../Node.AttributeNames';

type Dimension = 'inherit' | number;

const ExcalidrawComponent = React.lazy(() => import('./ExcalidrawComponent'));

export type SerializedExcalidrawNode = Spread<
  {
    data: string;
    height: Dimension;
    width: Dimension;
  },
  SerializedLexicalNode
>;

function $convertExcalidrawElement(domNode: HTMLElement): DOMConversionOutput | null {
  const excalidrawData = domNode.getAttribute(NodeAttributeNames.excalidraw);
  const styleAttributes = window.getComputedStyle(domNode);
  const heightStr = styleAttributes.getPropertyValue('height');
  const widthStr = styleAttributes.getPropertyValue('width');
  const height = !heightStr || heightStr === 'inherit' ? 'inherit' : parseInt(heightStr, 10);
  const width = !widthStr || widthStr === 'inherit' ? 'inherit' : parseInt(widthStr, 10);

  if (excalidrawData) {
    const node = $createExcalidrawNode();
    node.__data = excalidrawData;
    node.__height = height;
    node.__width = width;
    return {
      node,
    };
  }
  return null;
}

export class ExcalidrawNode extends DecoratorNode<JSX.Element> {
  __data: string;
  __height: Dimension;
  __width: Dimension;

  constructor(data = '[]', width: Dimension = 'inherit', height: Dimension = 'inherit', key?: NodeKey) {
    super(key);
    this.__data = data;
    this.__width = width;
    this.__height = height;
  }

  static clone(node: ExcalidrawNode): ExcalidrawNode {
    return new ExcalidrawNode(node.__data, node.__width, node.__height, node.__key);
  }

  static getType(): string {
    return 'excalidraw';
  }

  static importDOM(): DOMConversionMap<HTMLSpanElement> | null {
    return {
      span: (domNode: HTMLSpanElement) => {
        if (!domNode.hasAttribute(NodeAttributeNames.excalidraw)) {
          return null;
        }
        return {
          conversion: $convertExcalidrawElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedExcalidrawNode): ExcalidrawNode {
    return new ExcalidrawNode(serializedNode.data, serializedNode.width, serializedNode.height);
  }

  // View
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;

    span.style.width = this.__width === 'inherit' ? 'inherit' : `${this.__width}px`;
    span.style.height = this.__height === 'inherit' ? 'inherit' : `${this.__height}px`;

    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ExcalidrawComponent data={this.__data} nodeKey={this.getKey()} />
      </Suspense>
    );
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('span');

    element.style.display = 'inline-block';

    const content = editor.getElementByKey(this.getKey());
    if (content !== null) {
      const svg = content.querySelector('svg');
      if (svg !== null) {
        element.innerHTML = svg.outerHTML;
      }
    }

    element.style.width = this.__width === 'inherit' ? 'inherit' : `${this.__width}px`;
    element.style.height = this.__height === 'inherit' ? 'inherit' : `${this.__height}px`;

    element.setAttribute(NodeAttributeNames.excalidraw, this.__data);
    return { element };
  }

  exportJSON(): SerializedExcalidrawNode {
    return {
      type: 'excalidraw',
      data: this.__data,
      height: this.__height,
      version: 1,
      width: this.__width,
    };
  }

  setData(data: string): void {
    const self = this.getWritable();
    self.__data = data;
  }

  setHeight(height: Dimension): void {
    const self = this.getWritable();
    self.__height = height;
  }

  setWidth(width: Dimension): void {
    const self = this.getWritable();
    self.__width = width;
  }

  updateDOM(): false {
    return false;
  }
}

export function $createExcalidrawNode(): ExcalidrawNode {
  return new ExcalidrawNode();
}

export function $isExcalidrawNode(node: LexicalNode | null): node is ExcalidrawNode {
  return node instanceof ExcalidrawNode;
}
