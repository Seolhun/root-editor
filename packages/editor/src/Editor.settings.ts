export interface EditorSettings {
  debug: boolean;
  disableBeforeInput: boolean;
  /****************************************
   * Features Enables
   ****************************************/
  /**
   * @default false
   */
  enabledActionFeature: boolean;
  /**
   * @default false
   */
  enabledCommentFeature: boolean;
  /**
   * @default false
   */
  enabledEmbedFeature: boolean;
  /**
   * @default false
   */
  enabledEquationFeature: boolean;
  /**
   * @default true
   */
  enabledExcalidrawFeature: boolean;
  /**
   * @default true
   */
  enabledFigmaDocumentFeature: boolean;
  /**
   * @default true
   */
  enabledTweeterFeature: boolean;
  /**
   * @default true
   */
  enabledYoutubeFeature: boolean;
  /**
   * Auto complete feature
   */
  isAutocomplete: boolean;
  /**
   * Whether to enforce a maximum character limit on the editor
   * - Character count can be overflow the maximum length, but, text will be highlighted in red
   * @see isMaxLength
   */
  isCharLimit: boolean;
  isCharLimitUtf8: boolean;
  isCollaborative: boolean;
  /**
   * Whether to enforce a maximum length on the editor
   * - Text will be truncated at the maximum length
   * @see isCharLimit
   */
  isMaxLength: boolean;
  /**
   * Whether to use rich text or markdown
   * @default true
   */
  isRichText: boolean;
  /**
   * Measure typing performance
   * @default false
   */
  measureTypingPerf: boolean;
  shouldPreserveNewLinesInMarkdown: boolean;
  shouldUseLexicalContextMenu: boolean;
  showNestedEditorTreeView: boolean;
  showTableOfContents: boolean;
  /**
   * Whether to show the tree view in the editor
   */
  showTreeView: boolean;
  tableCellBackgroundColor: boolean;
  tableCellMerge: boolean;
}

export const DEFAULT_SETTINGS: EditorSettings = {
  debug: false,
  disableBeforeInput: false,
  /**
   * Features Enables
   */
  enabledActionFeature: false,
  enabledCommentFeature: false,
  enabledEmbedFeature: true,
  enabledEquationFeature: false,
  enabledExcalidrawFeature: true,
  enabledFigmaDocumentFeature: true,
  enabledTweeterFeature: true,
  enabledYoutubeFeature: true,
  /**
   * Auto complete feature
   */
  isAutocomplete: false,
  isCharLimit: true,
  isCharLimitUtf8: false,
  isCollaborative: false,
  isMaxLength: false,
  isRichText: true,
  measureTypingPerf: false,
  shouldPreserveNewLinesInMarkdown: false,
  shouldUseLexicalContextMenu: false,
  showNestedEditorTreeView: false,
  showTableOfContents: false,
  showTreeView: false,
  tableCellBackgroundColor: true,
  tableCellMerge: true,
} as const;

// These are mutated in setupEnv
export const INITIAL_SETTINGS: Record<keyof EditorSettings, boolean> = {
  ...DEFAULT_SETTINGS,
};
