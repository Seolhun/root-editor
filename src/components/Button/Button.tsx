import clsx from 'clsx';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

function Button({ className, children, disabled, title, ...rests }: ButtonProps) {
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
      aria-label={title}
      title={title}
    >
      {children}
    </button>
  );
}

export { Button };
export default Button;
