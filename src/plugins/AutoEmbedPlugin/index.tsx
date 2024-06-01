import type { LexicalEditor } from 'lexical';

import {
  AutoEmbedOption,
  EmbedConfig,
  EmbedMatchResult,
  LexicalAutoEmbedPlugin,
  URL_MATCHER,
} from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useMemo, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from '~/ui/Button';

import useModal from '../../hooks/useModal';
import { DialogActions } from '../../ui/Dialog';
import { INSERT_FIGMA_COMMAND } from '../FigmaPlugin';
import { INSERT_TWEET_COMMAND } from '../TwitterPlugin';
import { INSERT_YOUTUBE_COMMAND } from '../YouTubePlugin';

interface PlaygroundEmbedConfig extends EmbedConfig {
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

export const YoutubeEmbedConfig: PlaygroundEmbedConfig = {
  type: 'youtube-video',

  contentName: 'Youtube Video',

  exampleUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',

  // Icon for display.
  icon: <i className="icon youtube" />,

  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
  },

  keywords: ['youtube', 'video'],

  // Determine if a given URL is a match and return url data.
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
};

export const TwitterEmbedConfig: PlaygroundEmbedConfig = {
  type: 'tweet',

  // e.g. Tweet or Google Map.
  contentName: 'Tweet',

  exampleUrl: 'https://twitter.com/jack/status/20',

  // Icon for display.
  icon: <i className="icon tweet" />,

  // Create the Lexical embed node from the url data.
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id);
  },

  // For extra searching.
  keywords: ['tweet', 'twitter'],

  // Determine if a given URL is a match and return url data.
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
};

export const FigmaEmbedConfig: PlaygroundEmbedConfig = {
  type: 'figma',

  contentName: 'Figma Document',

  exampleUrl: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',

  icon: <i className="icon figma" />,

  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_FIGMA_COMMAND, result.id);
  },

  keywords: ['figma', 'figma.com', 'mock-up'],

  // Determine if a given URL is a match and return url data.
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
};

export const EmbedConfigs = [TwitterEmbedConfig, YoutubeEmbedConfig, FigmaEmbedConfig];

function AutoEmbedMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: AutoEmbedOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      aria-selected={isSelected}
      className={className}
      id={'typeahead-item-' + index}
      key={option.key}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={option.setRefElement}
      role="option"
      tabIndex={-1}
    >
      <span className="text">{option.title}</span>
    </li>
  );
}

function AutoEmbedMenu({
  onOptionClick,
  onOptionMouseEnter,
  options,
  selectedItemIndex,
}: {
  onOptionClick: (option: AutoEmbedOption, index: number) => void;
  onOptionMouseEnter: (index: number) => void;
  options: Array<AutoEmbedOption>;
  selectedItemIndex: null | number;
}) {
  return (
    <div className="typeahead-popover">
      <ul>
        {options.map((option: AutoEmbedOption, i: number) => (
          <AutoEmbedMenuItem
            index={i}
            isSelected={selectedItemIndex === i}
            key={option.key}
            onClick={() => onOptionClick(option, i)}
            onMouseEnter={() => onOptionMouseEnter(i)}
            option={option}
          />
        ))}
      </ul>
    </div>
  );
}

const debounce = (callback: (text: string) => void, delay: number) => {
  let timeoutId: number;
  return (text: string) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(text);
    }, delay);
  };
};

export function AutoEmbedDialog({
  embedConfig,
  onClose,
}: {
  embedConfig: PlaygroundEmbedConfig;
  onClose: () => void;
}): JSX.Element {
  const [text, setText] = useState('');
  const [editor] = useLexicalComposerContext();
  const [embedResult, setEmbedResult] = useState<EmbedMatchResult | null>(null);

  const validateText = useMemo(
    () =>
      debounce((inputText: string) => {
        const urlMatch = URL_MATCHER.exec(inputText);
        if (embedConfig != null && inputText != null && urlMatch != null) {
          Promise.resolve(embedConfig.parseUrl(inputText)).then((parseResult) => {
            setEmbedResult(parseResult);
          });
        } else if (embedResult != null) {
          setEmbedResult(null);
        }
      }, 200),
    [embedConfig, embedResult],
  );

  const onClick = () => {
    if (embedResult != null) {
      embedConfig.insertNode(editor, embedResult);
      onClose();
    }
  };

  return (
    <div style={{ width: '600px' }}>
      <div className="Input__wrapper">
        <input
          onChange={(e) => {
            const { value } = e.target;
            setText(value);
            validateText(value);
          }}
          className="Input__input"
          data-test-id={`${embedConfig.type}-embed-modal-url`}
          placeholder={embedConfig.exampleUrl}
          type="text"
          value={text}
        />
      </div>
      <DialogActions>
        <Button data-test-id={`${embedConfig.type}-embed-modal-submit-btn`} disabled={!embedResult} onClick={onClick}>
          Embed
        </Button>
      </DialogActions>
    </div>
  );
}

export default function AutoEmbedPlugin(): JSX.Element {
  const [modal, showModal] = useModal();

  const openEmbedModal = (embedConfig: PlaygroundEmbedConfig) => {
    showModal(`Embed ${embedConfig.contentName}`, (onClose) => (
      <AutoEmbedDialog embedConfig={embedConfig} onClose={onClose} />
    ));
  };

  const getMenuOptions = (activeEmbedConfig: PlaygroundEmbedConfig, embedFn: () => void, dismissFn: () => void) => {
    return [
      new AutoEmbedOption('Dismiss', {
        onSelect: dismissFn,
      }),
      new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
        onSelect: embedFn,
      }),
    ];
  };

  return (
    <>
      {modal}
      <LexicalAutoEmbedPlugin<PlaygroundEmbedConfig>
        menuRenderFn={(anchorElementRef, { options, selectOptionAndCleanUp, selectedIndex, setHighlightedIndex }) =>
          anchorElementRef.current
            ? ReactDOM.createPortal(
                <div
                  style={{
                    marginLeft: `${Math.max(parseFloat(anchorElementRef.current.style.width) - 200, 0)}px`,
                    width: 200,
                  }}
                  className="typeahead-popover auto-embed-menu"
                >
                  <AutoEmbedMenu
                    onOptionClick={(option: AutoEmbedOption, index: number) => {
                      setHighlightedIndex(index);
                      selectOptionAndCleanUp(option);
                    }}
                    onOptionMouseEnter={(index: number) => {
                      setHighlightedIndex(index);
                    }}
                    options={options}
                    selectedItemIndex={selectedIndex}
                  />
                </div>,
                anchorElementRef.current,
              )
            : null
        }
        embedConfigs={EmbedConfigs}
        getMenuOptions={getMenuOptions}
        onOpenEmbedModalForConfig={openEmbedModal}
      />
    </>
  );
}
