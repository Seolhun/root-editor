import * as React from 'react';

import { Dropdown } from '~/components/Dropdown';

import { ColorPicker } from '../components/ColorPicker/ColorPicker';

export type ColorPickerDropdownProps = {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  color: string;
  disabled?: boolean;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
  title?: string;
};

export function ColorPickerDropdown({
  buttonAriaLabel,
  buttonClassName,
  buttonIconClassName,
  buttonLabel,
  color,
  disabled = false,
  onChange,
  title,
}: ColorPickerDropdownProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Dropdown root={buttonRef.current} strategy="absolute">
      <Dropdown.Trigger
        aria-label={buttonAriaLabel}
        buttonIconClassName={buttonIconClassName}
        className={buttonClassName}
        disabled={disabled}
        ref={buttonRef}
        title={title}
      >
        {buttonLabel}
      </Dropdown.Trigger>

      <Dropdown.Panel>
        <ColorPicker color={color} onChange={onChange} />
      </Dropdown.Panel>
    </Dropdown>
  );
}
