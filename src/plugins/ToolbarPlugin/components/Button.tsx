import React from 'react';

import classNames from 'classnames';

function Button({
  'data-test-id': dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
}: {
  'data-test-id'?: string;
  children: JSX.Element | string | (JSX.Element | string)[];
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={classNames(
        'Button__root',
        {
          Button__disabled: disabled,
          Button__small: small,
        },
        className,
      )}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && { 'data-test-id': dataTestId })}
    >
      {children}
    </button>
  );
}

export { Button };
export default Button;
