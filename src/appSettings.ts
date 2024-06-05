export const DEFAULT_SETTINGS = {
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
  /**
   * Which Editor value tree debug view to show
   */
  showTreeView: true,
  tableCellBackgroundColor: true,
  tableCellMerge: true,
} as const;

// These are mutated in setupEnv
export const INITIAL_SETTINGS: Record<SettingName, boolean> = {
  ...DEFAULT_SETTINGS,
};

export type SettingName = keyof typeof DEFAULT_SETTINGS;

export type Settings = typeof INITIAL_SETTINGS;
