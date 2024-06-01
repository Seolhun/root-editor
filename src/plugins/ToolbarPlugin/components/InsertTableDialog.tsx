import type { LexicalEditor } from 'lexical';

import { INSERT_TABLE_COMMAND } from '@lexical/table';
import React from 'react';

import { Button, TextField } from '~/components';

export interface InsertTableDialogProps {
  activeEditor: LexicalEditor;
  onClose: () => void;
}

export function InsertTableDialog({ activeEditor, onClose }: InsertTableDialogProps): JSX.Element {
  const [rows, setRows] = React.useState('5');
  const [columns, setColumns] = React.useState('5');

  const onClick = React.useCallback(() => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows });
    onClose();
  }, [activeEditor, columns, onClose, rows]);

  const onChangeRows = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRows(e.target.value);
  }, []);

  const onChangeColumns = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setColumns(e.target.value);
  }, []);

  return (
    <>
      <TextField onChange={onChangeRows} value={rows}>
        {'No of rows'}
      </TextField>
      <TextField onChange={onChangeColumns} value={columns}>
        {'No of columns'}
      </TextField>
      <div className="ToolbarPlugin__dialogActions" data-test-id="table-model-confirm-insert">
        <Button onClick={onClick}>Confirm</Button>
      </div>
    </>
  );
}
