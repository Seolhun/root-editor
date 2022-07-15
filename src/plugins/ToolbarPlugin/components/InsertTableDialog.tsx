import React from 'react';
import type { LexicalEditor } from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';

import Button from './Button';
import TextInput from './TextInput';

export interface InsertTableDialogProps {
  activeEditor: LexicalEditor;
  onClose: () => void;
}

function InsertTableDialog({
  activeEditor,
  onClose,
}: InsertTableDialogProps): JSX.Element {
  const [rows, setRows] = React.useState('5');
  const [columns, setColumns] = React.useState('5');

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows });
    onClose();
  };

  return (
    <>
      <TextInput label="No of rows" onChange={setRows} value={rows} />
      <TextInput label="No of columns" onChange={setColumns} value={columns} />
      <div
        className="ToolbarPlugin__dialogActions"
        data-test-id="table-model-confirm-insert"
      >
        <Button onClick={onClick}>Confirm</Button>
      </div>
    </>
  );
}

export { InsertTableDialog };
export default InsertTableDialog;
