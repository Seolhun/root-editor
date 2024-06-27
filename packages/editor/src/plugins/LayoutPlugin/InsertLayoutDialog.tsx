import { LexicalEditor } from 'lexical';
import * as React from 'react';
import { useState } from 'react';

import { Dropdown } from '~/components';
import { Button } from '~/ui/Button';

import { INSERT_LAYOUT_COMMAND } from './LayoutPlugin';

const LAYOUTS = [
  { label: '2 columns (equal width)', value: '1fr 1fr' },
  { label: '2 columns (25% - 75%)', value: '1fr 3fr' },
  { label: '3 columns (equal width)', value: '1fr 1fr 1fr' },
  { label: '3 columns (25% - 50% - 25%)', value: '1fr 2fr 1fr' },
  { label: '4 columns (equal width)', value: '1fr 1fr 1fr 1fr' },
];

export interface InsertLayoutDialogProps {
  activeEditor: LexicalEditor;
  onClose: () => void;
}

export function InsertLayoutDialog({ activeEditor, onClose }: InsertLayoutDialogProps): JSX.Element {
  const [layout, setLayout] = useState(LAYOUTS[0].value);
  const buttonLabel = LAYOUTS.find((item) => item.value === layout)?.label;

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);
    onClose();
  };

  return (
    <>
      <Dropdown buttonClassName="toolbar-item dialog-dropdown" buttonLabel={buttonLabel}>
        <Dropdown.ItemList>
          {LAYOUTS.map(({ label, value }) => (
            <Dropdown.Item className="item" key={value} onClick={() => setLayout(value)}>
              <span className="text">{label}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.ItemList>
      </Dropdown>
      <Button onClick={onClick}>Insert</Button>
    </>
  );
}
