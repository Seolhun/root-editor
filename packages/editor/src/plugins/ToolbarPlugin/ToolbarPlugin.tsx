import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from '@lexical/selection';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import clsx from 'clsx';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import * as React from 'react';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown } from '~/components';
import { useSettings } from '~/context/settings';
import { useModal } from '~/hooks/useModal';
import { INSERT_COLLAPSIBLE_COMMAND } from '~/plugins/CollapsiblePlugin';
import { InsertEquationDialog } from '~/plugins/EquationsPlugin';
import { INSERT_EXCALIDRAW_COMMAND } from '~/plugins/ExcalidrawPlugin';
import { InsertImageDialog } from '~/plugins/ImagesPlugin';
import { InsertInlineImageDialog } from '~/plugins/InlineImagePlugin/InlineImagePlugin';
import { InsertLayoutDialog } from '~/plugins/LayoutPlugin/InsertLayoutDialog';
import { INSERT_PAGE_BREAK } from '~/plugins/PageBreakPlugin';
import { InsertPollDialog } from '~/plugins/PollPlugin';
import { InsertTableDialog } from '~/plugins/TablesPlugin';
import { IS_APPLE } from '~/shared/environment';
import { ColorPickerDropdown } from '~/ui/ColorPickerDropdown';
import { getSelectedNode } from '~/utils/getSelectedNode';
import { sanitizeUrl } from '~/utils/url';

import { EmbedDropdown } from './EmbedDropdown';
import { FontDropdown } from './FontDropdown';
import { FontSizer } from './FontSizer';

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

const HEADINGS: HeadingTagType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: string;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: 'center-align',
    iconRTL: 'center-align',
    name: 'Center Align',
  },
  end: {
    icon: 'right-align',
    iconRTL: 'left-align',
    name: 'End Align',
  },
  justify: {
    icon: 'justify-align',
    iconRTL: 'justify-align',
    name: 'Justify Align',
  },
  left: {
    icon: 'left-align',
    iconRTL: 'left-align',
    name: 'Left Align',
  },
  right: {
    icon: 'right-align',
    iconRTL: 'right-align',
    name: 'Right Align',
  },
  start: {
    icon: 'left-align',
    iconRTL: 'right-align',
    name: 'Start Align',
  },
};

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active dropdown-item-active';
  } else {
    return '';
  }
}

export interface BlockFormatDropdownProps {
  blockType: keyof typeof blockTypeToBlockName;
  disabled?: boolean;
  editor: LexicalEditor;
  rootType?: keyof typeof rootTypeToRootName;
}

function BlockFormatDropdown({ blockType, disabled = false, editor }: BlockFormatDropdownProps): JSX.Element {
  const { t } = useTranslation();

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Formatting options for text style"
        buttonIconClassName={'icon block-type ' + blockType}
        className="toolbar-item block-controls"
        disabled={disabled}
      >
        {blockTypeToBlockName[blockType]}
      </Dropdown.Trigger>
      <Dropdown.Panel>
        <Dropdown.Item
          className={clsx('item', dropDownActiveClass(blockType === 'paragraph'))}
          onClick={formatParagraph}
        >
          <i className="icon paragraph" />
          <span className="text">{t('toolbar.paragraph')}</span>
        </Dropdown.Item>
        {HEADINGS.map((heading) => (
          <Dropdown.Item
            className={clsx('item', dropDownActiveClass(blockType === heading))}
            key={heading}
            onClick={() => formatHeading(heading)}
          >
            <i className={clsx('icon', heading)} />
            <span className="text">{blockTypeToBlockName[heading]}</span>
          </Dropdown.Item>
        ))}
        <Dropdown.Item className={clsx('item', dropDownActiveClass(blockType === 'bullet'))} onClick={formatBulletList}>
          <i className="icon bullet-list" />
          <span className="text">{t('toolbar.bulleted_list')}</span>
        </Dropdown.Item>
        <Dropdown.Item
          className={clsx('item', dropDownActiveClass(blockType === 'number'))}
          onClick={formatNumberedList}
        >
          <i className="icon numbered-list" />
          <span className="text">{t('toolbar.numbered_list')}</span>
        </Dropdown.Item>
        <Dropdown.Item className={clsx('item', dropDownActiveClass(blockType === 'check'))} onClick={formatCheckList}>
          <i className="icon check-list" />
          <span className="text">{t('toolbar.checklist')}</span>
        </Dropdown.Item>
        <Dropdown.Item className={clsx('item', dropDownActiveClass(blockType === 'quote'))} onClick={formatQuote}>
          <i className="icon quote" />
          <span className="text">{t('toolbar.quote')}</span>
        </Dropdown.Item>
        <Dropdown.Item className={clsx('item', dropDownActiveClass(blockType === 'code'))} onClick={formatCode}>
          <i className="icon code" />
          <span className="text">{t('toolbar.code_block')}</span>
        </Dropdown.Item>
      </Dropdown.Panel>
    </Dropdown>
  );
}

function Divider(): JSX.Element {
  return <div className="divider" />;
}

interface ElementFormatDropdownProps {
  disabled: boolean;
  editor: LexicalEditor;
  isRTL: boolean;
  value: ElementFormatType;
}

function ElementFormatDropdown({ disabled = false, editor, isRTL, value }: ElementFormatDropdownProps) {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];
  const { t } = useTranslation();

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Formatting options for text alignment"
        buttonIconClassName={`icon ${isRTL ? formatOption.iconRTL : formatOption.icon}`}
        className="toolbar-item spaced alignment"
        disabled={disabled}
      >
        {formatOption.name}
      </Dropdown.Trigger>
      <Dropdown.Panel>
        <Dropdown.Item
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          }}
          className="item"
        >
          <i className="icon left-align" />
          <span className="text">{t('toolbar.left_align')}</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
          }}
          className="item"
        >
          <i className="icon center-align" />
          <span className="text">{t('toolbar.center_align')}</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
          }}
          className="item"
        >
          <i className="icon right-align" />
          <span className="text">{t('toolbar.right_align')}</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
          }}
          className="item"
        >
          <i className="icon justify-align" />
          <span className="text">{t('toolbar.justify_align')}</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');
          }}
          className="item"
        >
          <i className={`icon ${isRTL ? ELEMENT_FORMAT_OPTIONS.start.iconRTL : ELEMENT_FORMAT_OPTIONS.start.icon}`} />
          <span className="text">{t('toolbar.start_align')}</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');
          }}
          className="item"
        >
          <i className={`icon ${isRTL ? ELEMENT_FORMAT_OPTIONS.end.iconRTL : ELEMENT_FORMAT_OPTIONS.end.icon}`} />
          <span className="text">{t('toolbar.end_align')}</span>
        </Dropdown.Item>
        <Divider />
        <Dropdown.Item
          onClick={() => {
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          }}
          className="item"
        >
          <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
          <span className="text">{isRTL ? t('toolbar.indent') : t('toolbar.outdent')}</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
          }}
          className="item"
        >
          <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
          <span className="text">{isRTL ? t('toolbar.outdent') : t('toolbar.indent')}</span>
        </Dropdown.Item>
      </Dropdown.Panel>
    </Dropdown>
  );
}

export interface ToolbarPluginProps {
  setIsLinkEditMode: Dispatch<boolean>;
}

export function ToolbarPlugin({ setIsLinkEditMode }: ToolbarPluginProps): JSX.Element {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { enabledEquationFeature, enabledExcalidrawFeature } = settings;
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [Modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(language ? CODE_LANGUAGE_MAP[language] || language : '');
            return;
          }
        }
      }
      // Handle buttons
      setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000'));
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#fff'));
      setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '15px'));
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: null | string;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl('https://');
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {},
      );
    },
    [activeEditor],
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || $isTableSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();
        const extractedNodes = selection.extract();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0];
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  return (
    <div className="toolbar">
      <button
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        aria-label="Undo"
        className="toolbar-item spaced"
        disabled={!canUndo || !isEditable}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type="button"
      >
        <i className="format undo" />
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        aria-label="Redo"
        className="toolbar-item"
        disabled={!canRedo || !isEditable}
        title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
        type="button"
      >
        <i className="format redo" />
      </button>
      <Divider />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropdown blockType={blockType} disabled={!isEditable} editor={editor} rootType={rootType} />
          <Divider />
        </>
      )}
      {blockType === 'code' ? (
        <Dropdown>
          <Dropdown.Trigger
            aria-label="Select language"
            buttonIconClassName="icon code-language"
            className="toolbar-item code-language"
            disabled={!isEditable}
          >
            {getLanguageFriendlyName(codeLanguage)}
          </Dropdown.Trigger>
          <Dropdown.Panel>
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
              return (
                <Dropdown.Item
                  className={`item ${dropDownActiveClass(value === codeLanguage)}`}
                  key={value}
                  onClick={() => onCodeLanguageSelect(value)}
                >
                  <span className="text">{name}</span>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Panel>
        </Dropdown>
      ) : (
        <>
          <FontDropdown disabled={!isEditable} editor={editor} style={'font-family'} value={fontFamily} />

          <Divider />

          <FontSizer disabled={!isEditable} editor={editor} selectionFontSize={fontSize.slice(0, -2)} />

          <Divider />

          <div className="flex items-center">
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              }}
              aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}
              className={clsx('toolbar-item spaced', isBold ? 'active' : '')}
              disabled={!isEditable}
              title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
              type="button"
            >
              <i className="format bold" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
              aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'}`}
              className={clsx('toolbar-item spaced', isItalic ? 'active' : '')}
              disabled={!isEditable}
              title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
              type="button"
            >
              <i className="format italic" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
              aria-label={`Format text to underlined. Shortcut: ${IS_APPLE ? '⌘U' : 'Ctrl+U'}`}
              className={clsx('toolbar-item spaced', isUnderline ? 'active' : '')}
              disabled={!isEditable}
              title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
              type="button"
            >
              <i className="format underline" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}
              aria-label="Insert code block"
              className={clsx('toolbar-item spaced', isCode ? 'active' : '')}
              disabled={!isEditable}
              title="Insert code block"
              type="button"
            >
              <i className="format code" />
            </button>
            <button
              aria-label="Insert link"
              className={clsx('toolbar-item spaced', isLink ? 'active' : '')}
              disabled={!isEditable}
              onClick={insertLink}
              title="Insert link"
              type="button"
            >
              <i className="format link" />
            </button>

            <ColorPickerDropdown
              buttonAriaLabel="Formatting text color"
              buttonClassName="toolbar-item color-picker"
              buttonIconClassName="icon font-color"
              color={fontColor}
              disabled={!isEditable}
              onChange={onFontColorSelect}
              title="text color"
            />

            <ColorPickerDropdown
              buttonAriaLabel="Formatting background color"
              buttonClassName="toolbar-item color-picker"
              buttonIconClassName="icon bg-color"
              color={bgColor}
              disabled={!isEditable}
              onChange={onBgColorSelect}
              title="bg color"
            />

            <Dropdown>
              <Dropdown.Trigger
                aria-label="Formatting options for additional text styles"
                buttonIconClassName="icon dropdown-more"
                className="toolbar-item spaced"
                disabled={!isEditable}
              />
              <Dropdown.Panel>
                <Dropdown.Item
                  onClick={() => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                  }}
                  aria-label="Format text with a strikethrough"
                  className={clsx('item', dropDownActiveClass(isStrikethrough))}
                  title="Strikethrough"
                >
                  <i className="icon strikethrough" />
                  <span className="text">{t('toolbar.strikethrough')}</span>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
                  }}
                  aria-label="Format text with a subscript"
                  className={clsx('item', dropDownActiveClass(isSubscript))}
                  title="Subscript"
                >
                  <i className="icon subscript" />
                  <span className="text">{t('toolbar.subscript')}</span>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
                  }}
                  aria-label="Format text with a superscript"
                  className={clsx('item', dropDownActiveClass(isSuperscript))}
                  title="Superscript"
                >
                  <i className="icon superscript" />
                  <span className="text">{t('toolbar.superscript')}</span>
                </Dropdown.Item>
                <Dropdown.Item
                  aria-label="Clear all text formatting"
                  className="item"
                  onClick={clearFormatting}
                  title="Clear text formatting"
                >
                  <i className="icon clear" />
                  <span className="text">{t('toolbar.clear_formatting')}</span>
                </Dropdown.Item>
              </Dropdown.Panel>
            </Dropdown>
          </div>

          <Divider />

          <ElementFormatDropdown disabled={!isEditable} editor={editor} isRTL={isRTL} value={elementFormat} />

          <Divider />

          <Dropdown>
            <Dropdown.Trigger
              aria-label="Insert specialized editor node"
              buttonIconClassName="icon plus"
              className="toolbar-item spaced"
              disabled={!isEditable}
            >
              {t('insert')}
            </Dropdown.Trigger>
            <Dropdown.Panel>
              <Dropdown.Item
                onClick={() => {
                  activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
                }}
                className="item"
              >
                <i className="icon horizontal-rule" />
                <span className="text">{t('toolbar.horizontal_rule')}</span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
                }}
                className="item"
              >
                <i className="icon page-break" />
                <span className="text">{t('toolbar.page_break')}</span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  showModal('Insert Image', (onClose) => (
                    <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
                  ));
                }}
                className="item"
              >
                <i className="icon image" />
                <span className="text">{t('toolbar.image')}</span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  showModal('Insert Inline Image', (onClose) => (
                    <InsertInlineImageDialog activeEditor={activeEditor} onClose={onClose} />
                  ));
                }}
                className="item"
              >
                <i className="icon image" />
                <span className="text">{t('toolbar.inline_image')}</span>
              </Dropdown.Item>

              {enabledExcalidrawFeature && (
                <Dropdown.Item
                  onClick={() => {
                    activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
                  }}
                  className="item"
                >
                  <i className="icon diagram-2" />
                  <span className="text">{t('toolbar.excalidraw')}</span>
                </Dropdown.Item>
              )}

              <Dropdown.Item
                onClick={() => {
                  showModal('Insert Table', (onClose) => (
                    <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
                  ));
                }}
                className="item"
              >
                <i className="icon table" />
                <span className="text">{t('toolbar.table')}</span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  showModal('Insert Poll', (onClose) => (
                    <InsertPollDialog activeEditor={activeEditor} onClose={onClose} />
                  ));
                }}
                className="item"
              >
                <i className="icon poll" />
                <span className="text">{t('toolbar.poll')}</span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  showModal('Insert Columns Layout', (onClose) => (
                    <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
                  ));
                }}
                className="item"
              >
                <i className="icon columns" />
                <span className="text">{t('toolbar.columns_layout')}</span>
              </Dropdown.Item>

              {enabledEquationFeature && (
                <Dropdown.Item
                  onClick={() => {
                    showModal('Insert Equation', (onClose) => (
                      <InsertEquationDialog activeEditor={activeEditor} onClose={onClose} />
                    ));
                  }}
                  className="item"
                >
                  <i className="icon equation" />
                  <span className="text">{t('toolbar.equation')}</span>
                </Dropdown.Item>
              )}

              <Dropdown.Item
                onClick={() => {
                  editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
                }}
                className="item"
              >
                <i className="icon caret-right" />
                <span className="text">{t('toolbar.collapsible_container')}</span>
              </Dropdown.Item>
            </Dropdown.Panel>
          </Dropdown>

          <Divider />

          <EmbedDropdown editor={activeEditor} />
        </>
      )}

      {Modal}
    </div>
  );
}
