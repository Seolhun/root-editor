import type { DOMConversionMap, EditorConfig, LexicalNode, SerializedElementNode } from 'lexical';

import { addClassNamesToElement } from '@lexical/utils';
import { ElementNode } from 'lexical';

export type SerializedLayoutItemNode = SerializedElementNode;

export class LayoutItemNode extends ElementNode {
  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__key);
  }

  static getType(): string {
    return 'layout-item';
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(): LayoutItemNode {
    return $createLayoutItemNode();
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('div');
    if (typeof config.theme.layoutItem === 'string') {
      addClassNamesToElement(dom, config.theme.layoutItem);
    }
    return dom;
  }

  exportJSON(): SerializedLayoutItemNode {
    return {
      ...super.exportJSON(),
      type: 'layout-item',
      version: 1,
    };
  }

  isShadowRoot(): boolean {
    return true;
  }

  updateDOM(): boolean {
    return false;
  }
}

export function $createLayoutItemNode(): LayoutItemNode {
  return new LayoutItemNode();
}

export function $isLayoutItemNode(node: LexicalNode | null | undefined): node is LayoutItemNode {
  return node instanceof LayoutItemNode;
}
