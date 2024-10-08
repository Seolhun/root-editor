import { EditorSettings, INITIAL_SETTINGS } from './Editor.settings';

// Export a function so this is not tree-shaken,
// but evaluate it immediately so it executes before
// lexical computes CAN_USE_BEFORE_INPUT
export default (() => {
  // override default options with query parameters if any
  const urlSearchParams = new URLSearchParams(window.location.search);

  for (const param of Object.keys(INITIAL_SETTINGS)) {
    if (urlSearchParams.has(param)) {
      try {
        const value = JSON.parse(urlSearchParams.get(param) ?? 'true');
        INITIAL_SETTINGS[param as keyof EditorSettings] = Boolean(value);
      } catch (error) {
        console.warn(`Unable to parse query parameter "${param}"`);
      }
    }
  }

  if (INITIAL_SETTINGS.disableBeforeInput) {
    // @ts-expect-error
    delete window.InputEvent.prototype.getTargetRanges;
  }
  return INITIAL_SETTINGS;
})();
