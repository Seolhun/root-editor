import {
  AutoEmbedOption,
  EmbedMatchResult,
  LexicalAutoEmbedPlugin,
  URL_MATCHER,
} from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import clsx from 'clsx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import { useModal } from '~/hooks/useModal';
import { Button } from '~/ui/Button';
import { DialogActions } from '~/ui/Dialog';

import { EmbedConfigs } from './AutoEmbed.const';
import { RootEditorEmbedConfig } from './AutoEmbed.types';

export function AutoEmbedPlugin() {
  const [ModalNode, showModal] = useModal();

  const openEmbedModal = (embedConfig: RootEditorEmbedConfig) => {
    showModal(`Embed ${embedConfig.contentName}`, (onClose) => (
      <AutoEmbedDialog embedConfig={embedConfig} onClose={onClose} />
    ));
  };

  const getMenuOptions = (activeEmbedConfig: RootEditorEmbedConfig, embedFn: () => void, dismissFn: () => void) => {
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
      <LexicalAutoEmbedPlugin<RootEditorEmbedConfig>
        menuRenderFn={(anchorElementRef, { options, selectOptionAndCleanUp, selectedIndex, setHighlightedIndex }) => {
          const isEmpty = !options.length;
          if (isEmpty) {
            return null;
          }
          if (!anchorElementRef.current) {
            return null;
          }

          return ReactDOM.createPortal(
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
          );
        }}
        embedConfigs={EmbedConfigs}
        getMenuOptions={getMenuOptions}
        onOpenEmbedModalForConfig={openEmbedModal}
      />
      {ModalNode}
    </>
  );
}

interface AutoEmbedMenuItemProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: AutoEmbedOption;
}

function AutoEmbedMenuItem({ index, isSelected, onClick, onMouseEnter, option }: AutoEmbedMenuItemProps) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      aria-selected={isSelected}
      className={className}
      id={`typeahead-item-${index}`}
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

interface AutoEmbedMenuProps {
  onOptionClick: (option: AutoEmbedOption, index: number) => void;
  onOptionMouseEnter: (index: number) => void;
  options: Array<AutoEmbedOption>;
  selectedItemIndex: null | number;
}

function AutoEmbedMenu({ onOptionClick, onOptionMouseEnter, options, selectedItemIndex }: AutoEmbedMenuProps) {
  return (
    <div className={clsx('typeahead-popover')}>
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

interface AutoEmbedDialogProps {
  embedConfig: RootEditorEmbedConfig;
  onClose: () => void;
}

export function AutoEmbedDialog({ embedConfig, onClose }: AutoEmbedDialogProps): JSX.Element {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [text, setText] = React.useState('');
  const [embedResult, setEmbedResult] = React.useState<EmbedMatchResult | null>(null);

  const validateText = React.useMemo(() => {
    return debounce((inputText: string) => {
      const urlMatch = URL_MATCHER.exec(inputText);
      if (embedConfig != null && inputText != null && urlMatch != null) {
        Promise.resolve(embedConfig.parseUrl(inputText)).then((parseResult) => {
          setEmbedResult(parseResult);
        });
      } else if (embedResult != null) {
        setEmbedResult(null);
      }
    }, 200);
  }, [embedConfig, embedResult]);

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
          {t('embed')}
        </Button>
      </DialogActions>
    </div>
  );
}
