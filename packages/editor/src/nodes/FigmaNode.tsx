import type { EditorConfig, ElementFormatType, LexicalEditor, LexicalNode, NodeKey, Spread } from 'lexical';

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';

type FigmaComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  documentID: string;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
}>;

function FigmaComponent({ className, documentID, format, nodeKey }: FigmaComponentProps) {
  return (
    <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
      <iframe
        src={`https://www.figma.com/embed?embed_host=lexical&url=\
        https://www.figma.com/file/${documentID}`}
        allowFullScreen={true}
        height="315"
        width="560"
      />
    </BlockWithAlignableContents>
  );
}

export type SerializedFigmaNode = Spread<
  {
    documentID: string;
  },
  SerializedDecoratorBlockNode
>;

export class FigmaNode extends DecoratorBlockNode {
  __id: string;

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__id = id;
  }

  static clone(node: FigmaNode): FigmaNode {
    return new FigmaNode(node.__id, node.__format, node.__key);
  }

  static getType(): string {
    return 'figma';
  }

  static importJSON(serializedNode: SerializedFigmaNode): FigmaNode {
    const node = $createFigmaNode(serializedNode.documentID);
    node.setFormat(serializedNode.format);
    return node;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return (
      <FigmaComponent className={className} documentID={this.__id} format={this.__format} nodeKey={this.getKey()} />
    );
  }

  exportJSON(): SerializedFigmaNode {
    return {
      ...super.exportJSON(),
      type: 'figma',
      documentID: this.__id,
      version: 1,
    };
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined): string {
    return `https://www.figma.com/file/${this.__id}`;
  }

  updateDOM(): false {
    return false;
  }
}

export function $createFigmaNode(documentID: string): FigmaNode {
  return new FigmaNode(documentID);
}

export function $isFigmaNode(node: FigmaNode | LexicalNode | null | undefined): node is FigmaNode {
  return node instanceof FigmaNode;
}
