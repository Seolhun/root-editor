import * as React from 'react';

import { Dropdown } from '~/components/Dropdown';

import { ColorPicker } from './ColorPicker';

export type DropdownColorPickerProps = {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  color: string;
  disabled?: boolean;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
  title?: string;
};

export function DropdownColorPicker({
  buttonAriaLabel,
  buttonClassName,
  buttonIconClassName,
  buttonLabel,
  color,
  disabled = false,
  onChange,
  title,
}: DropdownColorPickerProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={buttonAriaLabel}
        buttonIconClassName={buttonIconClassName}
        className={buttonClassName}
        disabled={disabled}
        title={title}
      >
        {buttonLabel}
      </Dropdown.Trigger>
      <Dropdown.Panel>
        <Dropdown.Item>
          <ColorPicker color={color} onChange={onChange} />
        </Dropdown.Item>
      </Dropdown.Panel>
    </Dropdown>
  );
}
