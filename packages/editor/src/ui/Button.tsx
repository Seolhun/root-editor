import { ReactNode } from 'react';
import * as React from 'react';

import joinClasses from '../utils/joinClasses';

import './Button.scss';

export function Button({
  className,
  children,
  'data-test-id': dataTestId,
  disabled,
  onClick,
  small,
  title,
}: {
  children: ReactNode;
  className?: string;
  'data-test-id'?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
}): JSX.Element {
  return (
    <button
      aria-label={title}
      className={joinClasses('Button__root', disabled && 'Button__disabled', small && 'Button__small', className)}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
      {...(dataTestId && { 'data-test-id': dataTestId })}
    >
      {children}
    </button>
  );
}
