import { ChevronDownIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import React from 'react';

import { Opener } from '~/context/floating';

type ElementType = HTMLButtonElement;
type ElementProps = React.ButtonHTMLAttributes<ElementType>;

export interface DropdownTriggerProps {
  buttonIconClassName?: string;
}

export const DropdownTrigger = React.forwardRef<ElementType, ElementProps & DropdownTriggerProps>(
  ({ buttonIconClassName, children, ...others }, ref) => {
    return (
      <Opener.Trigger>
        <button {...others} ref={ref} type="button">
          {buttonIconClassName && <span className={buttonIconClassName} />}
          {children && <span className="text dropdown-button-text">{children}</span>}
          <ChevronDownIcon className={clsx('size-8')} />
        </button>
      </Opener.Trigger>
    );
  },
);
