import * as React from 'react';

import { Dropdown } from '~/components/Dropdown';

import ColorPicker from './ColorPicker';

export type DropdownColorPickerProps = {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  color: string;
  disabled?: boolean;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
  stopCloseOnClickSelf?: boolean;
  title?: string;
};

export function DropdownColorPicker({
  color,
  disabled = false,
  onChange,
  stopCloseOnClickSelf = true,
  ...rest
}: DropdownColorPickerProps) {
  return (
    <Dropdown {...rest} disabled={disabled}>
      <ColorPicker color={color} onChange={onChange} />
    </Dropdown>
  );
}
