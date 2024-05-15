import React from 'react';
import type { LexicalEditor } from 'lexical';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';
import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $wrapLeafNodesInElements } from '@lexical/selection';

import { Dropdown, DropdownItem } from '~/components';
import { BlockTypeEnum, BlockTypeToBlockNameEnum } from '~/Editor.const';

export interface BlockFormatDropdownProps {
  blockType: string;
  editor: LexicalEditor;
}

function isDropDownActiveClass(active: boolean) {
  if (active) return 'active dropdown-item-active';
  return '';
}

const HeadingSizes: HeadingTagType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

function BlockFormatDropdown({ editor, blockType }: BlockFormatDropdownProps): JSX.Element {
  const formatParagraph = React.useCallback(() => {
    if (blockType !== BlockTypeEnum.Paragraph) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode());
        }
      });
    }
  }, [blockType, editor]);

  const formatHeading = React.useCallback(
    (headingSize: HeadingTagType) => {
      if (blockType !== headingSize) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $wrapLeafNodesInElements(selection, () => $createHeadingNode(headingSize));
          }
        });
      }
    },
    [blockType, editor],
  );

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            $wrapLeafNodesInElements(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.removeText();
            selection.insertNodes([codeNode]);
            selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <Dropdown
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={`icon block-type ${blockType}`}
      buttonLabel={BlockTypeToBlockNameEnum[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <DropdownItem className={`item ${isDropDownActiveClass(blockType === 'paragraph')}`} onClick={formatParagraph}>
        <i className="icon paragraph" />
        <span className="text">Normal</span>
      </DropdownItem>
      <>
        {HeadingSizes.map((headingSize) => (
          <DropdownItem
            key={headingSize}
            className={`item ${isDropDownActiveClass(blockType === headingSize)}`}
            onClick={() => formatHeading(headingSize)}
          >
            <i className="icon h1" />
            <span className="text">{headingSize}</span>
          </DropdownItem>
        ))}
      </>
      <DropdownItem className={`item ${isDropDownActiveClass(blockType === 'bullet')}`} onClick={formatBulletList}>
        <i className="icon bullet-list" />
        <span className="text">Bullet List</span>
      </DropdownItem>
      <DropdownItem className={`item ${isDropDownActiveClass(blockType === 'number')}`} onClick={formatNumberedList}>
        <i className="icon numbered-list" />
        <span className="text">Numbered List</span>
      </DropdownItem>
      <DropdownItem className={`item ${isDropDownActiveClass(blockType === 'check')}`} onClick={formatCheckList}>
        <i className="icon check-list" />
        <span className="text">Check List</span>
      </DropdownItem>
      <DropdownItem className={`item ${isDropDownActiveClass(blockType === 'quote')}`} onClick={formatQuote}>
        <i className="icon quote" />
        <span className="text">Quote</span>
      </DropdownItem>
      <DropdownItem className={`item ${isDropDownActiveClass(blockType === 'code')}`} onClick={formatCode}>
        <i className="icon code" />
        <span className="text">Code Block</span>
      </DropdownItem>
    </Dropdown>
  );
}

export { BlockFormatDropdown };
export default BlockFormatDropdown;
