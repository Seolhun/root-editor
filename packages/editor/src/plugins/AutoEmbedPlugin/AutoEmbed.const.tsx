import { EmbedMatchResult } from '@lexical/react/LexicalAutoEmbedPlugin';
import { LexicalEditor } from 'lexical';
import * as React from 'react';

import { INSERT_FIGMA_COMMAND } from '../FigmaPlugin';
import { INSERT_TWEET_COMMAND } from '../TwitterPlugin';
import { INSERT_YOUTUBE_COMMAND } from '../YouTubePlugin';
import { RootEditorEmbedConfig } from './AutoEmbed.types';

export const YoutubeEmbedConfig = {
  type: 'youtube-video',
  contentName: 'Youtube Video',
  exampleUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
  icon: <i className="icon youtube" />,
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
  },
  keywords: ['youtube', 'video'],
  parseUrl: async (url: string) => {
    const match = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);
    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;
    if (id != null) {
      return {
        id,
        url,
      };
    }
    return null;
  },
} as const satisfies RootEditorEmbedConfig;

export const TwitterEmbedConfig = {
  type: 'tweet',
  contentName: 'Tweet',
  exampleUrl: 'https://x.com/seol_hooney/status/20',
  icon: <i className="icon tweet" />,
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id);
  },
  keywords: ['tweet', 'twitter'],
  parseUrl: (text: string) => {
    const match = /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(text);
    if (match != null) {
      return {
        id: match[5],
        url: match[1],
      };
    }
    return null;
  },
} as const satisfies RootEditorEmbedConfig;

export const FigmaEmbedConfig = {
  type: 'figma',
  contentName: 'Figma Document',
  exampleUrl: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
  icon: <i className="icon figma" />,
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_FIGMA_COMMAND, result.id);
  },
  keywords: ['figma', 'figma.com', 'mock-up'],
  parseUrl: (text: string) => {
    const match = /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.exec(text);
    if (match != null) {
      return {
        id: match[3],
        url: match[0],
      };
    }
    return null;
  },
} as const satisfies RootEditorEmbedConfig;

export const EmbedConfigs = [TwitterEmbedConfig, YoutubeEmbedConfig, FigmaEmbedConfig];
