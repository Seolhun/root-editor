import { CAN_USE_BEFORE_INPUT } from '@lexical/utils';
import clsx from 'clsx';
import * as React from 'react';

import { INITIAL_SETTINGS } from './Editor.settings';
import { EditorClasses } from './Editor.theme';
import { Opener } from './context/floating';
import { useSettings } from './context/settings';
import Switch from './ui/Switch';

export function Settings(): JSX.Element {
  const { setOption, settings } = useSettings();
  const {
    debug,
    disableBeforeInput,
    isAutocomplete,
    isCharLimit,
    isCharLimitUtf8,
    isCollaborative,
    isRichText,
    measureTypingPerf,
    shouldPreserveNewLinesInMarkdown,
    shouldUseLexicalContextMenu,
    showNestedEditorTreeView,
    showTableOfContents,
    showTreeView,
  } = settings;

  const settingButtonRef = React.useRef<HTMLButtonElement>(null);

  /**
   * Check if window object is available (to support SSR/CSR)
   */
  const isClient = typeof window !== 'undefined';

  const windowLocation = React.useMemo(() => {
    return isClient ? window.location : { pathname: '', search: '' };
  }, [isClient]);

  React.useEffect(() => {
    if (INITIAL_SETTINGS.disableBeforeInput && CAN_USE_BEFORE_INPUT) {
      console.error(`Legacy events are enabled (disableBeforeInput) but CAN_USE_BEFORE_INPUT is true`);
    }
  }, []);

  const [showSettings, setShowSettings] = React.useState(false);

  const [isSplitScreen, search] = React.useMemo(() => {
    const parentWindow = isClient ? window.parent : null;
    const _search = windowLocation.search;
    const _isSplitScreen = parentWindow && parentWindow.location.pathname === '/split/';
    return [_isSplitScreen, _search];
  }, [isClient, windowLocation.search]);

  return (
    <Opener root={settingButtonRef.current}>
      <Opener.Trigger
        className={`editor-dev-button ${showSettings ? 'active' : ''}`}
        id="options-button"
        onClick={() => setShowSettings(!showSettings)}
        ref={settingButtonRef}
      />
      <Opener.Content>
        <div className={clsx(EditorClasses.settings, 'switches')}>
          {isRichText && debug && (
            <Switch
              onClick={() => {
                setOption('isCollaborative', !isCollaborative);
                if (isClient) {
                  window.location.reload();
                }
              }}
              checked={isCollaborative}
              text="Collaboration"
            />
          )}
          {debug && isClient && (
            <Switch
              onClick={() => {
                if (isSplitScreen) {
                  window.parent.location.href = `/${search}`;
                } else {
                  window.location.href = `/split/${search}`;
                }
              }}
              checked={Boolean(isSplitScreen)}
              text="Split Screen"
            />
          )}
          <Switch
            checked={measureTypingPerf}
            onClick={() => setOption('measureTypingPerf', !measureTypingPerf)}
            text="Measure Perf"
          />
          <Switch checked={showTreeView} onClick={() => setOption('showTreeView', !showTreeView)} text="Debug View" />
          <Switch
            checked={showNestedEditorTreeView}
            onClick={() => setOption('showNestedEditorTreeView', !showNestedEditorTreeView)}
            text="Nested Editors Debug View"
          />
          <Switch
            onClick={() => {
              setOption('isRichText', !isRichText);
              setOption('isCollaborative', false);
            }}
            checked={isRichText}
            text="Rich Text"
          />
          <Switch checked={isCharLimit} onClick={() => setOption('isCharLimit', !isCharLimit)} text="Char Limit" />
          <Switch
            checked={isCharLimitUtf8}
            onClick={() => setOption('isCharLimitUtf8', !isCharLimitUtf8)}
            text="Char Limit (UTF-8)"
          />
          <Switch
            checked={isAutocomplete}
            onClick={() => setOption('isAutocomplete', !isAutocomplete)}
            text="Autocomplete"
          />
          <Switch
            onClick={() => {
              setOption('disableBeforeInput', !disableBeforeInput);
              setTimeout(() => {
                if (isClient) {
                  window.location.reload();
                }
              }, 500);
            }}
            checked={disableBeforeInput}
            text="Legacy Events"
          />
          <Switch
            onClick={() => {
              setOption('showTableOfContents', !showTableOfContents);
            }}
            checked={showTableOfContents}
            text="Table Of Contents"
          />
          <Switch
            onClick={() => {
              setOption('shouldUseLexicalContextMenu', !shouldUseLexicalContextMenu);
            }}
            checked={shouldUseLexicalContextMenu}
            text="Use Lexical Context Menu"
          />
          <Switch
            onClick={() => {
              setOption('shouldPreserveNewLinesInMarkdown', !shouldPreserveNewLinesInMarkdown);
            }}
            checked={shouldPreserveNewLinesInMarkdown}
            text="Preserve newlines in Markdown"
          />
        </div>
      </Opener.Content>
    </Opener>
  );
}
