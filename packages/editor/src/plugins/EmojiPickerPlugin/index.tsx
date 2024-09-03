import { autoPlacement, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import clsx from 'clsx';
import { $createTextNode, $getSelection, $isRangeSelection, TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';

class EmojiOption extends MenuOption {
  emoji: string;
  keywords: Array<string>;
  title: string;

  constructor(
    title: string,
    emoji: string,
    options: {
      keywords?: Array<string>;
    },
  ) {
    super(title);
    this.title = title;
    this.emoji = emoji;
    this.keywords = options.keywords || [];
  }
}
function EmojiMenuItem({
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
  option: EmojiOption;
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
      <span className="text">
        {option.emoji} {option.title}
      </span>
    </li>
  );
}

type Emoji = {
  aliases: Array<string>;
  category: string;
  description: string;
  emoji: string;
  ios_version: string;
  skin_tones?: boolean;
  tags: Array<string>;
  unicode_version: string;
};

const MAX_EMOJI_SUGGESTION_COUNT = 10;

interface EmojiPickerPluginProps {
  floatingAnchor: HTMLElement;
}

export function EmojiPickerPlugin({ floatingAnchor }: EmojiPickerPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<null | string>(null);
  const [emojis, setEmojis] = useState<Array<Emoji>>([]);

  useEffect(() => {
    import('~/utils/emoji-list').then((file) => setEmojis(file.default));
  }, []);

  const emojiOptions = useMemo(
    () =>
      emojis != null
        ? emojis.map(
            ({ aliases, emoji, tags }) =>
              new EmojiOption(aliases[0], emoji, {
                keywords: [...aliases, ...tags],
              }),
          )
        : [],
    [emojis],
  );

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {
    minLength: 0,
  });

  const options: Array<EmojiOption> = useMemo(() => {
    return emojiOptions
      .filter((option: EmojiOption) => {
        return queryString != null
          ? new RegExp(queryString, 'gi').exec(option.title) || option.keywords != null
            ? option.keywords.some((keyword: string) => new RegExp(queryString, 'gi').exec(keyword))
            : false
          : emojiOptions;
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
  }, [emojiOptions, queryString]);

  const onSelectOption = useCallback(
    (selectedOption: EmojiOption, nodeToRemove: null | TextNode, closeMenu: () => void) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || selectedOption == null) {
          return;
        }

        if (nodeToRemove) {
          nodeToRemove.remove();
        }

        selection.insertNodes([$createTextNode(selectedOption.emoji)]);

        closeMenu();
      });
    },
    [editor],
  );

  const { refs, strategy, x, y } = useFloating({
    middleware: [offset(15), autoPlacement(), shift()],
    placement: 'bottom',
  });

  return (
    <LexicalTypeaheadMenuPlugin
      menuRenderFn={(anchorElementRef, { selectOptionAndCleanUp, selectedIndex, setHighlightedIndex }) => {
        const isEmpty = !options.length;
        if (isEmpty) {
          return null;
        }

        return (
          <FloatingPortal root={anchorElementRef}>
            <div
              style={{
                left: x ?? 0,
                position: strategy,
                top: y ?? 0,
                width: 'max-content',
              }}
              ref={refs.setFloating}
            >
              <div className={clsx('typeahead-popover emoji-menu')}>
                <ul>
                  {options.map((option: EmojiOption, index) => (
                    <EmojiMenuItem
                      onClick={() => {
                        setHighlightedIndex(index);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(index);
                      }}
                      index={index}
                      isSelected={selectedIndex === index}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </FloatingPortal>
        );
      }}
      onOpen={(r) => {
        refs.setReference({
          getBoundingClientRect: r.getRect,
        });
      }}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={options}
      parent={floatingAnchor}
      triggerFn={checkForTriggerMatch}
    />
  );
}
