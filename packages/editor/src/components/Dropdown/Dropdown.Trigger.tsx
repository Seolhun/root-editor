import { ChevronDownIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import React from 'react';

import { Opener } from '~/context/floating';

type ElementType = HTMLButtonElement;
type ElementProps = React.ButtonHTMLAttributes<ElementType>;

export interface DropdownTriggerProps {
  buttonIconClassName?: string;
}

export function DropdownTrigger({ buttonIconClassName, children, ...others }: ElementProps & DropdownTriggerProps) {
  return (
    <Opener.Trigger>
      <button {...others} type="button">
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {children && <span className="text dropdown-button-text">{children}</span>}
        <ChevronDownIcon className={clsx('size-8')} />
      </button>
    </Opener.Trigger>
  );
}
