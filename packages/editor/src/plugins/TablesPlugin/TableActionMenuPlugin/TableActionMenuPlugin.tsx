import { FloatingPortal } from '@floating-ui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { $getTableCellNodeFromLexicalNode, TableCellNode } from '@lexical/table';
import { IconButton } from '@seolhun/root-ui';
import clsx from 'clsx';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { EditorClasses } from '~/Editor.theme';
import { useFloatingAreaContext } from '~/components';
import { useModal } from '~/hooks/useModal';

import { TableActionMenu } from './TableActionMenu';

interface TableCellActionMenuContainerProps {
  cellMerge: boolean;
}

function TableCellActionMenuContainer({ cellMerge }: TableCellActionMenuContainerProps) {
  const { floatingElement } = useFloatingAreaContext();
  const [editor] = useLexicalComposerContext();

  const tableActionContainerRef = useRef<HTMLDivElement>(null);
  const tableActionButtonRef = useRef<HTMLButtonElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tableCellNode, setTableMenuCellNode] = useState<null | TableCellNode>(null);
  const [ColorPickerModal, showColorPickerModal] = useModal();

  const $moveMenu = useCallback(() => {
    const menu = tableActionContainerRef.current;
    const selection = $getSelection();
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (selection == null || menu == null) {
      setTableMenuCellNode(null);
      return;
    }

    const rootElement = editor.getRootElement();
    const isRangeSelection = $isRangeSelection(selection);
    const hasRootElement = rootElement !== null;
    const hasNativeSelection = nativeSelection !== null;
    const isContainAnchorNode =
      hasRootElement && hasNativeSelection && rootElement.contains(nativeSelection.anchorNode);

    if (isRangeSelection && isContainAnchorNode) {
      const tableCellNodeFromSelection = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
      if (tableCellNodeFromSelection == null) {
        setTableMenuCellNode(null);
        return;
      }

      const tableCellElement = editor.getElementByKey(tableCellNodeFromSelection.getKey());
      if (tableCellElement == null) {
        setTableMenuCellNode(null);
        return;
      }

      setTableMenuCellNode(tableCellNodeFromSelection);
    } else if (!activeElement) {
      setTableMenuCellNode(null);
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        $moveMenu();
      });
    });
  });

  /**
   * @todo Why is this function we need to use?
   */
  useEffect(() => {
    const menuButtonDOM = tableActionContainerRef.current as HTMLButtonElement | null;
    if (menuButtonDOM != null && tableCellNode != null) {
      const tableCellNodeDOM = editor.getElementByKey(tableCellNode.getKey());
      if (tableCellNodeDOM != null && floatingElement != null) {
        const tableCellRect = tableCellNodeDOM.getBoundingClientRect();
        const menuRect = menuButtonDOM.getBoundingClientRect();
        const anchorRect = floatingElement.getBoundingClientRect();
        const top = tableCellRect.top - anchorRect.top + 4;
        const left = tableCellRect.right - menuRect.width - 10 - anchorRect.left;
        menuButtonDOM.style.opacity = '1';
        menuButtonDOM.style.transform = `translate(${left}px, ${top}px)`;
      } else {
        menuButtonDOM.style.opacity = '0';
        menuButtonDOM.style.transform = 'translate(-10000px, -10000px)';
      }
    }
  }, [tableActionContainerRef, tableCellNode, editor, floatingElement]);

  const prevTableCellDOM = useRef(tableCellNode);

  useEffect(() => {
    if (prevTableCellDOM.current !== tableCellNode) {
      setIsMenuOpen(false);
    }

    prevTableCellDOM.current = tableCellNode;
  }, [prevTableCellDOM, tableCellNode]);

  if (!floatingElement) {
    return null;
  }

  return (
    <div className={clsx(EditorClasses.tableCellActionButtonContainer)} ref={tableActionContainerRef}>
      {tableCellNode != null && (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={clsx(EditorClasses.tableCellActionButton, 'text-neutral-3 dark:text-neutral-7')}
            ref={tableActionButtonRef}
            type="button"
          >
            <ChevronDownIcon className={clsx('size-10')} />
          </IconButton>

          {isMenuOpen && (
            <FloatingPortal root={tableActionContainerRef}>
              <TableActionMenu
                cellMerge={cellMerge}
                onClose={() => setIsMenuOpen(false)}
                showColorPickerModal={showColorPickerModal}
                tableCellNode={tableCellNode}
              />
            </FloatingPortal>
          )}

          {ColorPickerModal}
        </>
      )}
    </div>
  );
}

export interface TableActionMenuPluginProps {
  cellMerge?: boolean;
}

export function TableActionMenuPlugin({ cellMerge = false }: TableActionMenuPluginProps) {
  const { floatingElement } = useFloatingAreaContext();
  const isEditable = useLexicalEditable();

  if (!isEditable) {
    return null;
  }
  if (!floatingElement) {
    return null;
  }
  return (
    <FloatingPortal root={floatingElement}>
      <TableCellActionMenuContainer cellMerge={cellMerge} />
    </FloatingPortal>
  );
}
