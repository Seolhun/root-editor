import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { $getTableCellNodeFromLexicalNode, TableCellNode } from '@lexical/table';
import clsx from 'clsx';
import { $getSelection, $isRangeSelection } from 'lexical';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { EditorClasses } from '~/Editor.theme';
import { useModal } from '~/hooks/useModal';

import { TableActionMenu } from './TableActionMenu';

interface TableCellActionMenuContainerProps {
  cellMerge: boolean;
  floatingAnchor: HTMLElement;
}

function TableCellActionMenuContainer({ cellMerge, floatingAnchor }: TableCellActionMenuContainerProps) {
  const [editor] = useLexicalComposerContext();

  const menuButtonRef = React.useRef(null);
  const menuRootRef = React.useRef(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [tableCellNode, setTableMenuCellNode] = React.useState<null | TableCellNode>(null);
  const [ColorPickerModal, showColorPickerModal] = useModal();

  const $moveMenu = React.useCallback(() => {
    const menu = menuButtonRef.current;
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

  React.useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        $moveMenu();
      });
    });
  });

  /**
   * @todo Why is this function we need to use?
   */
  React.useEffect(() => {
    const menuButtonDOM = menuButtonRef.current as HTMLButtonElement | null;
    if (menuButtonDOM != null && tableCellNode != null) {
      const tableCellNodeDOM = editor.getElementByKey(tableCellNode.getKey());
      if (tableCellNodeDOM != null) {
        const tableCellRect = tableCellNodeDOM.getBoundingClientRect();
        const menuRect = menuButtonDOM.getBoundingClientRect();
        const anchorRect = floatingAnchor.getBoundingClientRect();
        const top = tableCellRect.top - anchorRect.top + 4;
        const left = tableCellRect.right - menuRect.width - 10 - anchorRect.left;
        menuButtonDOM.style.opacity = '1';
        menuButtonDOM.style.transform = `translate(${left}px, ${top}px)`;
      } else {
        menuButtonDOM.style.opacity = '0';
        menuButtonDOM.style.transform = 'translate(-10000px, -10000px)';
      }
    }
  }, [menuButtonRef, tableCellNode, editor, floatingAnchor]);

  const prevTableCellDOM = React.useRef(tableCellNode);

  React.useEffect(() => {
    if (prevTableCellDOM.current !== tableCellNode) {
      setIsMenuOpen(false);
    }

    prevTableCellDOM.current = tableCellNode;
  }, [prevTableCellDOM, tableCellNode]);

  return (
    <div className={clsx(EditorClasses.tableCellActionButtonContainer)} ref={menuButtonRef}>
      {tableCellNode != null && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={clsx(EditorClasses.tableCellActionButton, 'text-neutral-3 dark:text-neutral-7')}
            ref={menuRootRef}
            type="button"
          >
            <ChevronDownIcon className={clsx('size-10')} />
          </button>

          {isMenuOpen && (
            <TableActionMenu
              cellMerge={cellMerge}
              contextRef={menuRootRef}
              onClose={() => setIsMenuOpen(false)}
              setIsMenuOpen={setIsMenuOpen}
              showColorPickerModal={showColorPickerModal}
              tableCellNode={tableCellNode}
            />
          )}

          {ColorPickerModal}
        </>
      )}
    </div>
  );
}

export interface TableActionMenuPluginProps {
  cellMerge?: boolean;
  floatingAnchor: HTMLElement;
}

export function TableActionMenuPlugin({ cellMerge = false, floatingAnchor }: TableActionMenuPluginProps) {
  const isEditable = useLexicalEditable();

  if (!isEditable) {
    return null;
  }
  return ReactDOM.createPortal(
    <TableCellActionMenuContainer cellMerge={cellMerge} floatingAnchor={floatingAnchor} />,
    floatingAnchor,
  );
}
