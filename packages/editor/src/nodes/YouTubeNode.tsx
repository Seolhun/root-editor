import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical';

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';

import { NodeAttributeNames } from './Node.AttributeNames';

type YouTubeComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  videoID: string;
}>;

function YouTubeComponent({ className, format, nodeKey, videoID }: YouTubeComponentProps) {
  return (
    <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
        frameBorder="0"
        height="500px"
        src={`https://www.youtube-nocookie.com/embed/${videoID}`}
        title="YouTube video"
        width="100%"
      />
    </BlockWithAlignableContents>
  );
}

export type SerializedYouTubeNode = Spread<
  {
    videoID: string;
  },
  SerializedDecoratorBlockNode
>;

function $convertYoutubeElement(domNode: HTMLElement): DOMConversionOutput | null {
  const videoID = domNode.getAttribute(NodeAttributeNames.youtube);
  if (videoID) {
    const node = $createYouTubeNode(videoID);
    return { node };
  }
  return null;
}

export class YouTubeNode extends DecoratorBlockNode {
  __id: string;

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__id = id;
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__format, node.__key);
  }

  static getType(): string {
    return 'youtube';
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute(NodeAttributeNames.youtube)) {
          return null;
        }
        return {
          conversion: $convertYoutubeElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    const node = $createYouTubeNode(serializedNode.videoID);
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
      <YouTubeComponent className={className} format={this.__format} nodeKey={this.getKey()} videoID={this.__id} />
    );
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute(NodeAttributeNames.youtube, this.__id);
    element.setAttribute('width', '560');
    element.setAttribute('height', '315');
    element.setAttribute('src', `https://www.youtube-nocookie.com/embed/${this.__id}`);
    element.setAttribute('frameborder', '0');
    element.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    );
    element.setAttribute('allowfullscreen', 'true');
    element.setAttribute('title', 'YouTube video');
    element.setAttribute(NodeAttributeNames.__nodeKey, this.getKey());
    return { element };
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      ...super.exportJSON(),
      type: 'youtube',
      version: 1,
      videoID: this.__id,
    };
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined): string {
    return `https://www.youtube.com/watch?v=${this.__id}`;
  }

  updateDOM(): false {
    return false;
  }
}

export function $createYouTubeNode(videoID: string): YouTubeNode {
  return new YouTubeNode(videoID);
}

export function $isYouTubeNode(node: LexicalNode | null | undefined | YouTubeNode): node is YouTubeNode {
  return node instanceof YouTubeNode;
}
