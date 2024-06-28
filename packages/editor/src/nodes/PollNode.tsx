import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { Suspense } from 'react';
import * as React from 'react';

export type Options = ReadonlyArray<Option>;

export type Option = Readonly<{
  text: string;
  uid: string;
  votes: Array<number>;
}>;

const PollComponent = React.lazy(() => import('./PollComponent'));

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);
}

export function createPollOption(text = ''): Option {
  return {
    text,
    uid: createUID(),
    votes: [],
  };
}

function cloneOption(option: Option, text: string, votes?: Array<number>): Option {
  return {
    text,
    uid: option.uid,
    votes: votes || Array.from(option.votes),
  };
}

export type SerializedPollNode = Spread<
  {
    options: Options;
    question: string;
  },
  SerializedLexicalNode
>;

function $convertPollElement(domNode: HTMLElement): DOMConversionOutput | null {
  const question = domNode.getAttribute('data-root-poll-question');
  const options = domNode.getAttribute('data-root-poll-options');
  if (question !== null && options !== null) {
    const node = $createPollNode(question, JSON.parse(options));
    return { node };
  }
  return null;
}

export class PollNode extends DecoratorNode<JSX.Element> {
  __options: Options;
  __question: string;

  constructor(question: string, options: Options, key?: NodeKey) {
    super(key);
    this.__question = question;
    this.__options = options;
  }

  static clone(node: PollNode): PollNode {
    return new PollNode(node.__question, node.__options, node.__key);
  }

  static getType(): string {
    return 'poll';
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-root-poll-question')) {
          return null;
        }
        return {
          conversion: $convertPollElement,
          priority: 2,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedPollNode): PollNode {
    const node = $createPollNode(serializedNode.question, serializedNode.options);
    serializedNode.options.forEach(node.addOption);
    return node;
  }

  addOption(option: Option): void {
    const self = this.getWritable();
    const options = Array.from(self.__options);
    options.push(option);
    self.__options = options;
  }

  createDOM(): HTMLElement {
    const elem = document.createElement('span');
    elem.style.display = 'inline-block';
    return elem;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <PollComponent nodeKey={this.__key} options={this.__options} question={this.__question} />
      </Suspense>
    );
  }

  deleteOption(option: Option): void {
    const self = this.getWritable();
    const options = Array.from(self.__options);
    const index = options.indexOf(option);
    options.splice(index, 1);
    self.__options = options;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-root-poll-question', this.__question);
    element.setAttribute('data-root-poll-options', JSON.stringify(this.__options));
    return { element };
  }

  exportJSON(): SerializedPollNode {
    return {
      type: 'poll',
      options: this.__options,
      question: this.__question,
      version: 1,
    };
  }

  setOptionText(option: Option, text: string): void {
    const self = this.getWritable();
    const clonedOption = cloneOption(option, text);
    const options = Array.from(self.__options);
    const index = options.indexOf(option);
    options[index] = clonedOption;
    self.__options = options;
  }

  toggleVote(option: Option, clientID: number): void {
    const self = this.getWritable();
    const votes = option.votes;
    const votesClone = Array.from(votes);
    const voteIndex = votes.indexOf(clientID);
    if (voteIndex === -1) {
      votesClone.push(clientID);
    } else {
      votesClone.splice(voteIndex, 1);
    }
    const clonedOption = cloneOption(option, option.text, votesClone);
    const options = Array.from(self.__options);
    const index = options.indexOf(option);
    options[index] = clonedOption;
    self.__options = options;
  }

  updateDOM(): false {
    return false;
  }
}

export function $createPollNode(question: string, options: Options): PollNode {
  return new PollNode(question, options);
}

export function $isPollNode(node: LexicalNode | null | undefined): node is PollNode {
  return node instanceof PollNode;
}
