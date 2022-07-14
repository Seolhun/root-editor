/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { NodeKey, TextNode } from 'lexical';

export class EmojiNode extends TextNode {
  __className;

  static getType() {
    return 'emoji';
  }

  static clone(node) {
    return new EmojiNode(node.__className, node.__text, node.__key);
  }

  constructor(className: string, text: string, key?: NodeKey) {
    super(text, key);
    this.__className = className;
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.className = this.__className;
    return dom;
  }

  // updateDOM(prevNode: EmojiNode, dom: HTMLElement, config: EditorConfig): boolean {
  //   const isUpdated = super.updateDOM(prevNode, dom, config);
  //   if (prevNode.__color !== this.__color) {
  //     dom.style.color = this.__color;
  //   }
  //   return isUpdated;
  // }
}

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className, emojiText: string, key?: NodeKey) {
  return new EmojiNode(className, emojiText, key).setMode('token');
}
