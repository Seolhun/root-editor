/* eslint-disable no-param-reassign */
import React from 'react';
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { createPortal } from 'react-dom';
import { $isCodeNode } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $isHeadingNode } from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $selectAll,
} from '@lexical/selection';
import {
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';

import { Select, Dropdown, DropdownItem, Divider } from '@/components';
import { getSelectedNode } from '@/utils';
import { BlockTypeEnum } from '@/Editor.const';
import useModal from './components/useModal';
import { IS_APPLE } from './environments';
import {
  BlockFormatDropdown,
  FloatingLinkEditor,
  InsertTableDialog,
} from './components';
import {
  CODE_LANGUAGE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
} from './ToolbarPlugin.const';

const supportedBlockTypes = new Set([
  BlockTypeEnum.Bullet,
  BlockTypeEnum.Check,
  BlockTypeEnum.Code,
  BlockTypeEnum.H1,
  BlockTypeEnum.H2,
  BlockTypeEnum.H3,
  BlockTypeEnum.H4,
  BlockTypeEnum.H5,
  BlockTypeEnum.H6,
  BlockTypeEnum.Number,
  BlockTypeEnum.Paragraph,
  BlockTypeEnum.Quote,
]);

const CODE_LANGUAGE_MAP = {
  javascript: 'js',
  md: 'markdown',
  plaintext: 'plain',
  python: 'py',
  text: 'plain',
};

function dropDownActiveClass(active: boolean) {
  if (active) return 'active dropdown-item-active';
  return '';
}

function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = React.useState(editor);
  const [blockType, setBlockType] = React.useState(BlockTypeEnum.Paragraph);
  const [selectedElementKey, setSelectedElementKey] =
    React.useState<string>('');
  const [fontSize, setFontSize] = React.useState<string>('15px');
  const [fontColor, setFontColor] = React.useState<string>('#000');
  const [bgColor, setBgColor] = React.useState<string>('#fff');
  const [fontFamily, setFontFamily] = React.useState<string>('Arial');
  const [isLink, setIsLink] = React.useState(false);
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [isSubscript, setIsSubscript] = React.useState(false);
  const [isSuperscript, setIsSuperscript] = React.useState(false);
  const [isCode, setIsCode] = React.useState(false);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [ModalElement, showModal] = useModal();
  const [isRTL, setIsRTL] = React.useState(false);
  const [codeLanguage, setCodeLanguage] = React.useState<string>('');

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
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

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type as BlockTypeEnum);
          if ($isCodeNode(element)) {
            const language = element.getLanguage();
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
      );
    }
  }, [activeEditor]);

  React.useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  React.useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
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
  }, [activeEditor, updateToolbar]);

  const applyStyleText = React.useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor],
  );

  const clearFormatting = React.useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $selectAll(selection);
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle('');
            $getNearestBlockElementAncestorOrThrow(node).setFormat('');
          }
          if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const onFontSizeSelect = React.useCallback(
    (e) => {
      applyStyleText({ 'font-size': e.target.value });
    },
    [applyStyleText],
  );

  const onFontFamilySelect = React.useCallback(
    (e) => {
      applyStyleText({ 'font-family': e.target.value });
    },
    [applyStyleText],
  );

  const insertLink = React.useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onCodeLanguageSelect = React.useCallback(
    (e) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  const isBlockTypeOf = React.useCallback(
    (targetBlockType: BlockTypeEnum) => {
      return blockType === targetBlockType;
    },
    [blockType],
  );

  const isCodeBlock = isBlockTypeOf(BlockTypeEnum.Code);
  return (
    <div className="toolbar">
      <button
        type="button"
        disabled={!canUndo}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        type="button"
        disabled={!canRedo}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Redo (⌘Y)' : 'Undo (Ctrl+Y)'}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      {supportedBlockTypes.has(blockType) && activeEditor === editor && (
        <>
          <BlockFormatDropdown blockType={blockType} editor={editor} />
          <Divider />
        </>
      )}
      {isCodeBlock ? (
        <>
          <Select
            className="toolbar-item code-language"
            onChange={onCodeLanguageSelect}
            options={CODE_LANGUAGE_OPTIONS}
            value={codeLanguage}
          />
          <i className="chevron-down inside" />
        </>
      ) : (
        <>
          <>
            <Select
              className="toolbar-item font-family"
              onChange={onFontFamilySelect}
              options={FONT_FAMILY_OPTIONS}
              value={fontFamily}
            />
            <i className="chevron-down inside" />
          </>
          <>
            <Select
              className="toolbar-item font-size"
              onChange={onFontSizeSelect}
              options={FONT_SIZE_OPTIONS}
              value={fontSize}
            />
            <i className="chevron-down inside" />
          </>
          <Divider />
          <button
            type="button"
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            className={`toolbar-item spaced ${isBold ? 'active' : ''}`}
            title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? '⌘B' : 'Ctrl+B'
            }`}
          >
            <i className="format bold" />
          </button>
          <button
            type="button"
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            className={`toolbar-item spaced ${isItalic ? 'active' : ''}`}
            title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? '⌘I' : 'Ctrl+I'
            }`}
          >
            <i className="format italic" />
          </button>
          <button
            type="button"
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            className={`toolbar-item spaced ${isUnderline ? 'active' : ''}`}
            title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? '⌘U' : 'Ctrl+U'
            }`}
          >
            <i className="format underline" />
          </button>
          <button
            type="button"
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
            className={`toolbar-item spaced ${isCode ? 'active' : ''}`}
            title="Insert code block"
            aria-label="Insert code block"
          >
            <i className="format code" />
          </button>
          <button
            type="button"
            onClick={insertLink}
            className={`toolbar-item spaced ${isLink ? 'active' : ''}`}
            aria-label="Insert link"
            title="Insert link"
          >
            <i className="format link" />
          </button>
          {isLink &&
            createPortal(
              <FloatingLinkEditor editor={activeEditor} />,
              document.body,
            )}
          <Dropdown
            buttonClassName="toolbar-item spaced"
            buttonLabel=""
            buttonAriaLabel="Formatting options for additional text styles"
            buttonIconClassName="icon dropdown-more"
          >
            <DropdownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'strikethrough',
                );
              }}
              className={`item ${dropDownActiveClass(isStrikethrough)}`}
              title="Strikethrough"
              aria-label="Format text with a strikethrough"
            >
              <i className="icon strikethrough" />
              <span className="text">Strikethrough</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
              }}
              className={`item ${dropDownActiveClass(isSubscript)}`}
              title="Subscript"
              aria-label="Format text with a subscript"
            >
              <i className="icon subscript" />
              <span className="text">Subscript</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'superscript',
                );
              }}
              className={`item ${dropDownActiveClass(isSuperscript)}`}
              title="Superscript"
              aria-label="Format text with a superscript"
            >
              <i className="icon superscript" />
              <span className="text">Superscript</span>
            </DropdownItem>
            <DropdownItem
              onClick={clearFormatting}
              className="item"
              title="Clear text formatting"
              aria-label="Clear all text formatting"
            >
              <i className="icon clear" />
              <span className="text">Clear Formatting</span>
            </DropdownItem>
          </Dropdown>
          <Divider />
          <Dropdown
            buttonClassName="toolbar-item spaced"
            buttonLabel="Insert"
            buttonAriaLabel="Insert specialized editor node"
            buttonIconClassName="icon plus"
          >
            <DropdownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined,
                );
              }}
              className="item"
            >
              <i className="icon horizontal-rule" />
              <span className="text">Horizontal Rule</span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                showModal('Insert Table', (onClose) => (
                  <InsertTableDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
            >
              <i className="icon table" />
              <span className="text">Table</span>
            </DropdownItem>
          </Dropdown>
        </>
      )}
      <Divider />
      <Dropdown
        buttonLabel="Align"
        buttonIconClassName="icon left-align"
        buttonClassName="toolbar-item spaced alignment"
        buttonAriaLabel="Formatting options for text alignment"
      >
        <DropdownItem
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          }}
          className="item"
        >
          <i className="icon left-align" />
          <span className="text">Left Align</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
          }}
          className="item"
        >
          <i className="icon center-align" />
          <span className="text">Center Align</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
          }}
          className="item"
        >
          <i className="icon right-align" />
          <span className="text">Right Align</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
          }}
          className="item"
        >
          <i className="icon justify-align" />
          <span className="text">Justify Align</span>
        </DropdownItem>
        <Divider />
        <DropdownItem
          onClick={() => {
            activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          }}
          className="item"
        >
          <i className={`icon ${isRTL ? 'indent' : 'outdent'}`} />
          <span className="text">Outdent</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
          }}
          className="item"
        >
          <i className={`icon ${isRTL ? 'outdent' : 'indent'}`} />
          <span className="text">Indent</span>
        </DropdownItem>
      </Dropdown>

      {ModalElement}
    </div>
  );
}

export { ToolbarPlugin };
export default ToolbarPlugin;
