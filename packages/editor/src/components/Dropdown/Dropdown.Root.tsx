import React from 'react';

import { Opener, useFloatingAreaContext } from '~/components';

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
    <Opener root={floatingElement}>
      <Opener.Trigger>
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
      </Opener.Trigger>

      <Opener.Content>
        <DropdownContextProvider>{children}</DropdownContextProvider>
      </Opener.Content>
    </Opener>
  );
}
