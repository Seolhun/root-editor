import type { EditorConfig, LexicalNode, NodeKey, SerializedTextNode, Spread } from 'lexical';

import { $applyNodeReplacement, TextNode } from 'lexical';

export type SerializedEmojiNode = Spread<
  {
    className: string;
  },
  SerializedTextNode
>;

export class EmojiNode extends TextNode {
  __className: string;

  constructor(className: string, text: string, key?: NodeKey) {
    super(text, key);
    this.__className = className;
  }

  static clone(node: EmojiNode): EmojiNode {
    return new EmojiNode(node.__className, node.__text, node.__key);
  }

  static getType(): string {
    return 'emoji';
  }

  static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
    const node = $createEmojiNode(serializedNode.className, serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('span');
    const inner = super.createDOM(config);
    dom.className = this.__className;
    inner.className = 'emoji-inner';
    dom.appendChild(inner);
    return dom;
  }

  exportJSON(): SerializedEmojiNode {
    return {
      ...super.exportJSON(),
      type: 'emoji',
      className: this.getClassName(),
    };
  }

  getClassName(): string {
    const self = this.getLatest();
    return self.__className;
  }

  updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
    const inner = dom.firstChild;
    if (inner === null) {
      return true;
    }
    super.updateDOM(prevNode, inner as HTMLElement, config);
    return false;
  }
}

export function $isEmojiNode(node: LexicalNode | null | undefined): node is EmojiNode {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className: string, emojiText: string): EmojiNode {
  const node = new EmojiNode(className, emojiText).setMode('token');
  return $applyNodeReplacement(node);
}
