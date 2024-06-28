import { LexicalEditor } from 'lexical';
import { useState } from 'react';
import * as React from 'react';

import { Dropdown } from '~/components';
import { useI18n } from '~/context/i18n';
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
  const { t } = useI18n();
  const [layout, setLayout] = useState(LAYOUTS[0].value);
  const buttonLabel = LAYOUTS.find((item) => item.value === layout)?.label;

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);
    onClose();
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Trigger className="toolbar-item dialog-dropdown">{buttonLabel}</Dropdown.Trigger>
        <Dropdown.Panel>
          {LAYOUTS.map(({ label, value }) => (
            <Dropdown.Item className="item" key={value} onClick={() => setLayout(value)}>
              <span className="text">{label}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Panel>
      </Dropdown>
      <Button onClick={onClick}>{t('insert')}</Button>
    </>
  );
}
