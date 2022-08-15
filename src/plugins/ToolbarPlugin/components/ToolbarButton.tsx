import React from 'react';

import classNames from 'classnames';

export interface ToolbarButtonProps {
  small?: boolean;
  disabled?: boolean;
}

type HtmlProps = React.HTMLAttributes<HTMLButtonElement>;
function ToolbarButton({ children, className, title, small, disabled, ...rests }: ToolbarButtonProps & HtmlProps) {
  return (
    <button
      type="button"
      {...rests}
      className={classNames(
        'Button__root',
        {
          Button__disabled: disabled,
          Button__small: small,
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

export { ToolbarButton };
export default ToolbarButton;
