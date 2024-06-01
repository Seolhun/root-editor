import React from 'react';

import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

function Button({ children, className, title, disabled, ...rests }: ButtonProps) {
  return (
    <button
      type="button"
      {...rests}
      className={clsx(
        'Root__Button',
        {
          'Root__Button-disabled': disabled,
        },
        className,
      )}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

export { Button };
export default Button;
