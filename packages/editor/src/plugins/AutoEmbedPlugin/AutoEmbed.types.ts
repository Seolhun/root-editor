import { EmbedConfig } from '@lexical/react/LexicalAutoEmbedPlugin';

export interface RootEditorEmbedConfig extends EmbedConfig {
  // Human readable name of the embeded content e.g. Tweet or Google Map.
  contentName: string;

  // Embed a Figma Project.
  description?: string;

  // An example of a matching url https://twitter.com/jack/status/20
  exampleUrl: string;

  // Icon for display.
  icon?: JSX.Element;

  // For extra searching.
  keywords: Array<string>;
}
