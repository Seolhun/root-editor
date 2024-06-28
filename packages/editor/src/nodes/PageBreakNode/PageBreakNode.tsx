import {
  COMMAND_PRIORITY_HIGH,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  LexicalNode,
  SerializedLexicalNode,
} from 'lexical';
import * as React from 'react';

const PageBreakComponent = React.lazy(() => import('./PageBreakComponent'));

export type SerializedPageBreakNode = SerializedLexicalNode;

export class PageBreakNode extends DecoratorNode<JSX.Element> {
  static clone(node: PageBreakNode): PageBreakNode {
    return new PageBreakNode(node.__key);
  }

  static getType(): string {
    return 'page-break';
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figure: (domNode: HTMLElement) => {
        const tp = domNode.getAttribute('type');
        if (tp !== this.getType()) {
          return null;
        }

        return {
          conversion: $convertPageBreakElement,
          priority: COMMAND_PRIORITY_HIGH,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedPageBreakNode): PageBreakNode {
    return $createPageBreakNode();
  }

  createDOM(): HTMLElement {
    const el = document.createElement('figure');
    el.style.pageBreakAfter = 'always';
    el.setAttribute('type', this.getType());
    return el;
  }

  decorate(): JSX.Element {
    return <PageBreakComponent nodeKey={this.__key} />;
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: this.getType(),
      version: 1,
    };
  }

  getTextContent(): string {
    return '\n';
  }

  isInline(): false {
    return false;
  }

  updateDOM(): boolean {
    return false;
  }
}

function $convertPageBreakElement(): DOMConversionOutput {
  return {
    node: $createPageBreakNode(),
  };
}

export function $createPageBreakNode(): PageBreakNode {
  return new PageBreakNode();
}

export function $isPageBreakNode(node: LexicalNode | null | undefined): node is PageBreakNode {
  return node instanceof PageBreakNode;
}
