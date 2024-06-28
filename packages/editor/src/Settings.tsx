import { CAN_USE_BEFORE_INPUT } from '@lexical/utils';
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { INITIAL_SETTINGS } from './Editor.settings';
import { EditorClasses } from './Editor.theme';
import { Opener } from './context/floating';
import { useSettings } from './context/settings/SettingsContext';
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

  const settingButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * TODO: We should support SSR/CSR. so, we should use `window` object in a proper way.
   */
  const windowLocation = window.location;

  useEffect(() => {
    if (INITIAL_SETTINGS.disableBeforeInput && CAN_USE_BEFORE_INPUT) {
      console.error(`Legacy events are enabled (disableBeforeInput) but CAN_USE_BEFORE_INPUT is true`);
    }
  }, []);

  const [showSettings, setShowSettings] = useState(false);
  const [isSplitScreen, search] = useMemo(() => {
    const parentWindow = window.parent;
    const _search = windowLocation.search;
    const _isSplitScreen = parentWindow && parentWindow.location.pathname === '/split/';
    return [_isSplitScreen, _search];
  }, [windowLocation]);

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
                window.location.reload();
              }}
              checked={isCollaborative}
              text="Collaboration"
            />
          )}
          {debug && (
            <Switch
              onClick={() => {
                if (isSplitScreen) {
                  window.parent.location.href = `/${search}`;
                } else {
                  window.location.href = `/split/${search}`;
                }
              }}
              checked={isSplitScreen}
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
              setTimeout(() => window.location.reload(), 500);
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
