import type {
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import katex from 'katex';
import { $applyNodeReplacement, DecoratorNode, DOMExportOutput } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

const EquationComponent = React.lazy(() => import('./EquationComponent'));

export type SerializedEquationNode = Spread<
  {
    equation: string;
    inline: boolean;
  },
  SerializedLexicalNode
>;

function $convertEquationElement(domNode: HTMLElement): DOMConversionOutput | null {
  let equation = domNode.getAttribute('data-root-equation');
  const inline = domNode.getAttribute('data-root-inline') === 'true';
  // Decode the equation from base64
  equation = atob(equation || '');
  if (equation) {
    const node = $createEquationNode(equation, inline);
    return { node };
  }

  return null;
}

export class EquationNode extends DecoratorNode<JSX.Element> {
  __equation: string;
  __inline: boolean;

  constructor(equation: string, inline?: boolean, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline ?? false;
  }

  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key);
  }

  static getType(): string {
    return 'equation';
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-root-equation')) {
          return null;
        }
        return {
          conversion: $convertEquationElement,
          priority: 2,
        };
      },
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-root-equation')) {
          return null;
        }
        return {
          conversion: $convertEquationElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    const node = $createEquationNode(serializedNode.equation, serializedNode.inline);
    return node;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement(this.__inline ? 'span' : 'div');
    // EquationNodes should implement `user-action:none` in their CSS to avoid issues with deletion on Android.
    element.className = 'editor-equation';
    return element;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <EquationComponent equation={this.__equation} inline={this.__inline} nodeKey={this.__key} />
      </Suspense>
    );
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement(this.__inline ? 'span' : 'div');
    // Encode the equation as base64 to avoid issues with special characters
    const equation = btoa(this.__equation);
    element.setAttribute('data-root-equation', equation);
    element.setAttribute('data-root-inline', `${this.__inline}`);
    katex.render(this.__equation, element, {
      displayMode: !this.__inline, // true === block display //
      errorColor: '#cc0000',
      output: 'html',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    });
    return { element };
  }

  exportJSON(): SerializedEquationNode {
    return {
      type: 'equation',
      equation: this.getEquation(),
      inline: this.__inline,
      version: 1,
    };
  }

  getEquation(): string {
    return this.__equation;
  }

  getTextContent(): string {
    return this.__equation;
  }

  setEquation(equation: string): void {
    const writable = this.getWritable();
    writable.__equation = equation;
  }

  updateDOM(prevNode: EquationNode): boolean {
    // If the inline property changes, replace the element
    return this.__inline !== prevNode.__inline;
  }
}

export function $createEquationNode(equation = '', inline = false): EquationNode {
  const equationNode = new EquationNode(equation, inline);
  return $applyNodeReplacement(equationNode);
}

export function $isEquationNode(node: LexicalNode | null | undefined): node is EquationNode {
  return node instanceof EquationNode;
}
