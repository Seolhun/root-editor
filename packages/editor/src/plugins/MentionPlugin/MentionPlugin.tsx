import { FloatingPortal } from '@floating-ui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import clsx from 'clsx';
import { TextNode } from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import * as React from 'react';

import { EditorClasses } from '~/Editor.theme';
import { useFloatingAreaContext } from '~/context/floating';
import { $createMentionNode } from '~/nodes/MentionNode';

import { AtSignMentionsRegex, AtSignMentionsRegexAliasRegex } from './MentionPlugin.const';
import {
  FetchMentionOptionsAsyncFn,
  FetMentionOptionsFn,
  MentionOption,
  RenderMentionOptionFn,
} from './MentionPlugin.types';
import { MentionsTypeaheadMenuItem } from './MentionsTypeaheadMenuItem';

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

export interface MentionPluginProps {
  /**
   * If you want to show mention options synchronously, use this prop.
   */
  fetchMentionOptions?: FetMentionOptionsFn;
  /**
   * If you want to fetch mention options asynchronously, use this function.
   */
  fetchMentionOptionsAsync?: FetchMentionOptionsAsyncFn;
  /**
   * If you want to customize the mention option rendering, use this prop.
   */
  renderMentionOption?: RenderMentionOptionFn;
}

export function MentionPlugin({
  fetchMentionOptions,
  fetchMentionOptionsAsync,
  renderMentionOption,
}: MentionPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const { floatingElement } = useFloatingAreaContext();
  const [mentionOptions, setMentionOptions] = React.useState<MentionOption[]>([]);

  const [queryString, setQueryString] = useState<null | string>(null);
  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  React.useEffect(() => {
    const getMentionOptions = async () => {
      if (fetchMentionOptions) {
        return fetchMentionOptions(queryString);
      }
      if (fetchMentionOptionsAsync) {
        const result = await fetchMentionOptionsAsync(queryString);
        return result;
      }
      return [];
    };
    getMentionOptions().then((options) => {
      setMentionOptions(options);
    });
  }, [fetchMentionOptions, fetchMentionOptionsAsync, queryString]);

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

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  if (!floatingElement) {
    return null;
  }

  return (
    <LexicalTypeaheadMenuPlugin<MentionOption>
      menuRenderFn={(anchorElementRef, { selectOptionAndCleanUp, selectedIndex, setHighlightedIndex }) => {
        const isEmpty = !anchorElementRef.current || !mentionOptions.length;
        if (isEmpty) {
          return null;
        }

        return (
          <FloatingPortal root={anchorElementRef}>
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
            </div>
          </FloatingPortal>
        );
      }}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={mentionOptions}
      parent={floatingElement}
      triggerFn={checkForMentionMatch}
    />
  );
}
