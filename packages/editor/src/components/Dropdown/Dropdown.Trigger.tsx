import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Opener } from '@seolhun/root-ui';
import clsx from 'clsx';
import React from 'react';

type ElementType = HTMLButtonElement;
type ElementProps = React.ButtonHTMLAttributes<ElementType>;

export interface DropdownTriggerProps {
  buttonIconClassName?: string;
}

export const DropdownTrigger = React.forwardRef<ElementType, ElementProps & DropdownTriggerProps>(
  ({ children, buttonIconClassName, ...others }, ref) => {
    return (
      <Opener.Trigger {...others} ref={ref} type="button">
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {children && <span className="text dropdown-button-text">{children}</span>}
        <ChevronDownIcon className={clsx('size-8')} />
      </Opener.Trigger>
    );
  },
);
