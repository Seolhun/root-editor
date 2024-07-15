import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import clsx from 'clsx';
import { TextNode } from 'lexical';
import { useCallback, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { EditorClasses } from '~/Editor.theme';
import { $createMentionNode } from '~/nodes/MentionNode';

import { AtSignMentionsRegex, AtSignMentionsRegexAliasRegex } from './MentionPlugin.const';
import { FetchMentionOptionsFn, MentionOption, RenderMentionOptionFn } from './MentionPlugin.types';
import { MentionsTypeaheadMenuItem } from './MentionsTypeaheadMenuItem';

export interface MentionPluginProps extends ExternalMentionPluginProps {
  floatingAnchor: HTMLElement;
}

export interface ExternalMentionPluginProps {
  /**
   * If you want to fetch mention options asynchronously, use this function.
   */
  fetchMentionOptions?: FetchMentionOptionsFn;
  /**
   * If you want to customize the mention option rendering, use this prop.
   */
  renderMentionOption?: RenderMentionOptionFn;
}

export function MentionPlugin({
  fetchMentionOptions,
  floatingAnchor,
  renderMentionOption,
}: MentionPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [mentionOptions, setMentionOptions] = React.useState<MentionOption[]>([]);

  const [queryString, setQueryString] = useState<null | string>(null);
  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  React.useEffect(() => {
    const getMentionOptions = async () => {
      if (fetchMentionOptions) {
        const result = await fetchMentionOptions(queryString);
        return result;
      }
      return [];
    };
    getMentionOptions().then((options) => {
      setMentionOptions(options);
    });
  }, [fetchMentionOptions, queryString]);

  const onSelectOption = useCallback(
    (selectedOption: MentionOption, nodeToReplace: null | TextNode, closeMenu: () => void) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.name);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const triggerMentionFn = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionOption>
      menuRenderFn={(anchorElementRef, { selectOptionAndCleanUp, selectedIndex, setHighlightedIndex }) => {
        const isEmpty = !mentionOptions.length;
        if (isEmpty) {
          return null;
        }
        if (!anchorElementRef.current) {
          return null;
        }

        return ReactDOM.createPortal(
          <div className={clsx('typeahead-popover', EditorClasses.mention)}>
            <ul className={EditorClasses.mentionList}>
              {mentionOptions.map((option, i: number) => {
                if (renderMentionOption) {
                  return renderMentionOption(option, i);
                }
                return (
                  <MentionsTypeaheadMenuItem
                    onClick={() => {
                      setHighlightedIndex(i);
                      selectOptionAndCleanUp(option);
                    }}
                    onMouseEnter={() => {
                      setHighlightedIndex(i);
                    }}
                    index={i}
                    isSelected={selectedIndex === i}
                    key={option.key}
                    option={option}
                  />
                );
              })}
            </ul>
          </div>,
          anchorElementRef.current,
        );
      }}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={mentionOptions}
      parent={floatingAnchor}
      triggerFn={triggerMentionFn}
    />
  );
}

function checkForAtSignMentions(text: string, minMatchLength: number): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);
  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];
    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 1);
}
