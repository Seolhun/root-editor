export interface EditorSettings {
  debug: boolean;
  disableBeforeInput: boolean;
  isAutocomplete: boolean;
  isCharLimit: boolean;
  isCharLimitUtf8: boolean;
  isCollaborative: boolean;
  isMaxLength: boolean;
  isRichText: boolean;
  measureTypingPerf: boolean;
  shouldPreserveNewLinesInMarkdown: boolean;
  shouldUseLexicalContextMenu: boolean;
  showNestedEditorTreeView: boolean;
  showTableOfContents: boolean;
  /**
   * Which Editor value tree debug view to show
   */
  showTreeView: boolean;
  tableCellBackgroundColor: boolean;
  tableCellMerge: boolean;
}

export const DEFAULT_SETTINGS: EditorSettings = {
  debug: false,
  disableBeforeInput: false,
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
  showTreeView: true,
  tableCellBackgroundColor: true,
  tableCellMerge: true,
} as const;

// These are mutated in setupEnv
export const INITIAL_SETTINGS: Record<EditorSettingsKey, boolean> = {
  ...DEFAULT_SETTINGS,
};

export type EditorSettingsKey = keyof EditorSettings;
