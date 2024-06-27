import React from 'react';

import { Tooltip, useFloatingAreaContext } from '~/components';

import { DropdownContextProvider } from './Dropdown.Context';

export interface DropdownProps {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  children: (JSX.Element | string)[] | JSX.Element | string;
  disabled?: boolean;
}

export function DropdownRoot({
  buttonAriaLabel,
  buttonClassName,
  buttonIconClassName,
  buttonLabel,
  children,
  disabled,
}: DropdownProps) {
  const { floatingElement } = useFloatingAreaContext();

  if (!floatingElement) {
    return null;
  }

  return (
    <Tooltip root={floatingElement}>
      <Tooltip.Trigger>
        <button
          aria-label={buttonAriaLabel || buttonLabel}
          className={buttonClassName}
          disabled={disabled}
          type="button"
        >
          {buttonIconClassName && <span className={buttonIconClassName} />}
          {buttonLabel && <span className="text dropdown-button-text">{buttonLabel}</span>}
          <i className="chevron-down" />
        </button>
      </Tooltip.Trigger>

      <Tooltip.Content>
        <DropdownContextProvider>{children}</DropdownContextProvider>
      </Tooltip.Content>
    </Tooltip>
  );
}
