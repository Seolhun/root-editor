import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  SerializedElementNode,
} from 'lexical';

import { NodeAttributeNames } from '~/nodes/Node.AttributeNames';
import { IS_CHROME } from '~/shared/environment';
import invariant from '~/shared/invariant';

import { $isCollapsibleContainerNode } from './CollapsibleContainerNode';
import { domOnBeforeMatch, setDomHiddenUntilFound } from './CollapsibleUtils';

type SerializedCollapsibleContentNode = SerializedElementNode;

export function $convertCollapsibleContentElement(domNode: HTMLElement): DOMConversionOutput | null {
  const node = $createCollapsibleContentNode();
  return {
    node,
  };
}

export class CollapsibleContentNode extends ElementNode {
  static clone(node: CollapsibleContentNode): CollapsibleContentNode {
    return new CollapsibleContentNode(node.__key);
  }

  static getType(): string {
    return 'collapsible-content';
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute(NodeAttributeNames.collapsible_content)) {
          return null;
        }
        return {
          conversion: $convertCollapsibleContentElement,
          priority: 2,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedCollapsibleContentNode): CollapsibleContentNode {
    return $createCollapsibleContentNode();
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement('div');
    dom.classList.add('Collapsible__content');
    if (IS_CHROME) {
      editor.getEditorState().read(() => {
        const containerNode = this.getParentOrThrow();
        invariant($isCollapsibleContainerNode(containerNode), 'Expected parent node to be a CollapsibleContainerNode');
        if (!containerNode.__open) {
          setDomHiddenUntilFound(dom);
        }
      });
      domOnBeforeMatch(dom, () => {
        editor.update(() => {
          const containerNode = this.getParentOrThrow().getLatest();
          invariant(
            $isCollapsibleContainerNode(containerNode),
            'Expected parent node to be a CollapsibleContainerNode',
          );
          if (!containerNode.__open) {
            containerNode.toggleOpen();
          }
        });
      });
    }
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.classList.add('Collapsible__content');
    element.setAttribute(NodeAttributeNames.collapsible_content, 'true');
    element.setAttribute(NodeAttributeNames.__nodeKey, this.getKey());
    return { element };
  }

  exportJSON(): SerializedCollapsibleContentNode {
    return {
      ...super.exportJSON(),
      type: 'collapsible-content',
      version: 1,
    };
  }

  isShadowRoot(): boolean {
    return true;
  }

  updateDOM(prevNode: CollapsibleContentNode, dom: HTMLElement): boolean {
    return false;
  }
}

export function $createCollapsibleContentNode(): CollapsibleContentNode {
  return new CollapsibleContentNode();
}

export function $isCollapsibleContentNode(node: LexicalNode | null | undefined): node is CollapsibleContentNode {
  return node instanceof CollapsibleContentNode;
}
