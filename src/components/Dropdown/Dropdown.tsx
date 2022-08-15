import React from 'react';
import { createPortal } from 'react-dom';
import DropdownContextProvider from './Dropdown.Context';
import { DropdownItemList } from './Dropdown.ItemList';

export interface DropdownProps {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  children: JSX.Element | string | (JSX.Element | string)[];
  stopCloseOnClickSelf?: boolean;
}

function Dropdown({
  buttonLabel,
  buttonAriaLabel,
  buttonClassName,
  buttonIconClassName,
  children,
}: DropdownProps): JSX.Element {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropDownRef = React.useRef<HTMLDivElement>(null);
  const [isShowDropdown, setShowDropdown] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setShowDropdown(false);
    if (buttonRef && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  React.useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;

    if (isShowDropdown && button !== null && dropDown !== null) {
      const { top, left } = button.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
    }
  }, [isShowDropdown]);

  React.useEffect(() => {
    const button = buttonRef.current;
    if (button !== null && isShowDropdown) {
      const handle = (event: MouseEvent) => {
        const { target } = event;
        if (!button.contains(target as Node)) {
          setShowDropdown(false);
        }
      };
      document.addEventListener('click', handle);
      return () => {
        document.removeEventListener('click', handle);
      };
    }
    return undefined;
  }, [isShowDropdown]);

  const showDropdown = React.useCallback(() => {
    setShowDropdown((prevIsShow) => !prevIsShow);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={buttonAriaLabel || buttonLabel}
        className={buttonClassName}
        onClick={showDropdown}
      >
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {buttonLabel && <span className="text dropdown-button-text">{buttonLabel}</span>}
        <i className="chevron-down" />
      </button>

      <DropdownContextProvider>
        {isShowDropdown &&
          createPortal(
            <DropdownItemList ref={dropDownRef} onClose={handleClose}>
              {children}
            </DropdownItemList>,
            document.body,
          )}
      </DropdownContextProvider>
    </>
  );
}

export { Dropdown };
export default Dropdown;
