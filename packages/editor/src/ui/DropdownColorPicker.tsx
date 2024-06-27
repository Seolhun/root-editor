import * as React from 'react';

import ColorPicker from './ColorPicker';
import DropDown from './DropDown';

type Props = {
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

export default function DropdownColorPicker({
  color,
  disabled = false,
  onChange,
  stopCloseOnClickSelf = true,
  ...rest
}: Props) {
  return (
    <DropDown {...rest} disabled={disabled} stopCloseOnClickSelf={stopCloseOnClickSelf}>
      <ColorPicker color={color} onChange={onChange} />
    </DropDown>
  );
}
