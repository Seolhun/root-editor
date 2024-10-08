import { autoPlacement, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react';
import { $createCodeNode } from '@lexical/code';
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import clsx from 'clsx';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  TextNode,
} from 'lexical';
import * as React from 'react';

import { EditorClasses } from '~/Editor.theme';
import { useModal } from '~/hooks/useModal';
import { EmbedConfigs } from '~/plugins/AutoEmbedPlugin';
import { INSERT_COLLAPSIBLE_COMMAND } from '~/plugins/CollapsiblePlugin';
import { InsertEquationDialog } from '~/plugins/EquationsPlugin';
import { INSERT_EXCALIDRAW_COMMAND } from '~/plugins/ExcalidrawPlugin';
import { InsertImageDialog } from '~/plugins/ImagesPlugin';
import { InsertLayoutDialog } from '~/plugins/LayoutPlugin';
import { INSERT_PAGE_BREAK } from '~/plugins/PageBreakPlugin';
import { InsertPollDialog } from '~/plugins/PollPlugin';
import { InsertTableDialog } from '~/plugins/TablesPlugin';

import { ComponentPickerOption } from './ComponentPickerOption';

interface ComponentPickerPluginProps {
  floatingAnchor: HTMLElement;
}

export function ComponentPickerPlugin({ floatingAnchor }: ComponentPickerPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [ModalNode, showModal] = useModal();
  const [queryString, setQueryString] = React.useState<null | string>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = React.useMemo(() => {
    const baseOptions = getBaseOptions(editor, showModal);

    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, 'i');

    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) => regex.test(option.title) || option.keywords.some((keyword) => regex.test(keyword)),
      ),
    ];
  }, [editor, queryString, showModal]);

  const onSelectOption = React.useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: null | TextNode,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
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
    <>
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        menuRenderFn={(anchorElementRef, { selectOptionAndCleanUp, selectedIndex, setHighlightedIndex }) => {
          return (
            <FloatingPortal root={anchorElementRef}>
              <div
                style={{
                  left: x ?? 0,
                  position: strategy,
                  top: y ?? 0,
                  width: 'max-content',
                }}
                className={clsx(EditorClasses.componentPicker, 'typeahead-popover component-picker-menu')}
                ref={refs.setFloating}
              >
                <ul className="min-h-96">
                  {options.map((option, i: number) => (
                    <ComponentPickerMenuItem
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
                  ))}
                </ul>
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

      {ModalNode}
    </>
  );
}

function ComponentPickerMenuItem({
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
  option: ComponentPickerOption;
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
      {option.icon}
      <span className="text">{option.title}</span>
    </li>
  );
}

function getDynamicOptions(editor: LexicalEditor, queryString: string) {
  const options: ComponentPickerOption[] = [];

  if (queryString == null) {
    return options;
  }

  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2] ? [tableMatch[2]] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: <i className="icon table" />,
            keywords: ['table'],
            onSelect: () => editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
          }),
      ),
    );
  }

  return options;
}

type ShowModal = ReturnType<typeof useModal>[1];

function getBaseOptions(editor: LexicalEditor, showModal: ShowModal) {
  return [
    new ComponentPickerOption('Paragraph', {
      icon: <i className="icon paragraph" />,
      keywords: ['normal', 'paragraph', 'p', 'text'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),
    ...([1, 2, 3] as const).map(
      (n) =>
        new ComponentPickerOption(`Heading ${n}`, {
          icon: <i className={`icon h${n}`} />,
          keywords: ['heading', 'header', `h${n}`],
          onSelect: () =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
              }
            }),
        }),
    ),
    new ComponentPickerOption('Table', {
      icon: <i className="icon table" />,
      keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
      onSelect: () =>
        showModal('Insert Table', (onClose) => <InsertTableDialog activeEditor={editor} onClose={onClose} />),
    }),
    new ComponentPickerOption('Numbered List', {
      icon: <i className="icon number" />,
      keywords: ['numbered list', 'ordered list', 'ol'],
      onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Bulleted List', {
      icon: <i className="icon bullet" />,
      keywords: ['bulleted list', 'unordered list', 'ul'],
      onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Check List', {
      icon: <i className="icon check" />,
      keywords: ['check list', 'todo list'],
      onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Quote', {
      icon: <i className="icon quote" />,
      keywords: ['block quote'],
      onSelect: () => {
        return editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        });
      },
    }),
    new ComponentPickerOption('Code', {
      icon: <i className="icon code" />,
      keywords: ['javascript', 'python', 'js', 'codeblock'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              // Will this ever happen?
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection.insertRawText(textContent);
            }
          }
        }),
    }),
    new ComponentPickerOption('Divider', {
      icon: <i className="icon horizontal-rule" />,
      keywords: ['horizontal rule', 'divider', 'hr'],
      onSelect: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
    new ComponentPickerOption('Page Break', {
      icon: <i className="icon page-break" />,
      keywords: ['page break', 'divider'],
      onSelect: () => editor.dispatchCommand(INSERT_PAGE_BREAK, undefined),
    }),
    new ComponentPickerOption('Excalidraw', {
      icon: <i className="icon diagram-2" />,
      keywords: ['excalidraw', 'diagram', 'drawing'],
      onSelect: () => editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined),
    }),
    new ComponentPickerOption('Poll', {
      icon: <i className="icon poll" />,
      keywords: ['poll', 'vote'],
      onSelect: () =>
        showModal('Insert Poll', (onClose) => {
          return <InsertPollDialog activeEditor={editor} onClose={onClose} />;
        }),
    }),
    ...EmbedConfigs.map(
      (embedConfig) =>
        new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
          icon: embedConfig.icon,
          keywords: [...embedConfig.keywords, 'embed'],
          onSelect: () => editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
        }),
    ),
    new ComponentPickerOption('Equation', {
      icon: <i className="icon equation" />,
      keywords: ['equation', 'latex', 'math'],
      onSelect: () =>
        showModal('Insert Equation', (onClose) => {
          return <InsertEquationDialog activeEditor={editor} onClose={onClose} />;
        }),
    }),
    new ComponentPickerOption('Image', {
      icon: <i className="icon image" />,
      keywords: ['image', 'photo', 'picture', 'file'],
      onSelect: () => {
        return showModal('Insert Image', (onClose) => {
          return <InsertImageDialog activeEditor={editor} onClose={onClose} />;
        });
      },
    }),
    new ComponentPickerOption('Collapsible', {
      icon: <i className="icon caret-right" />,
      keywords: ['collapse', 'collapsible', 'toggle'],
      onSelect: () => editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined),
    }),
    new ComponentPickerOption('Columns Layout', {
      icon: <i className="icon columns" />,
      keywords: ['columns', 'layout', 'grid'],
      onSelect: () =>
        showModal('Insert Columns Layout', (onClose) => <InsertLayoutDialog activeEditor={editor} onClose={onClose} />),
    }),
    ...(['left', 'center', 'right', 'justify'] as const).map(
      (alignment) =>
        new ComponentPickerOption(`Align ${alignment}`, {
          icon: <i className={`icon ${alignment}-align`} />,
          keywords: ['align', 'justify', alignment],
          onSelect: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
        }),
    ),
  ];
}
