import React from 'react';
import { createPortal } from 'react-dom';

import { useFloatingAreaContext } from '~/context/floating';
import { useClientReady } from '~/hooks/useClientReady';

import DropdownContextProvider from './Dropdown.Context';
import { DropdownItemList } from './Dropdown.ItemList';

export interface DropdownProps {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  children: (JSX.Element | string)[] | JSX.Element | string;
  stopCloseOnClickSelf?: boolean;
}

function Dropdown({ buttonAriaLabel, buttonClassName, buttonIconClassName, buttonLabel, children }: DropdownProps) {
  const { floatingElement } = useFloatingAreaContext();
  const isClientReady = useClientReady();
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
      const { left, top } = button.getBoundingClientRect();
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

  if (!isClientReady) {
    return null;
  }

  return (
    <>
      <button
        aria-label={buttonAriaLabel || buttonLabel}
        className={buttonClassName}
        onClick={showDropdown}
        ref={buttonRef}
        type="button"
      >
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {buttonLabel && <span className="text dropdown-button-text">{buttonLabel}</span>}
        <i className="chevron-down" />
      </button>

      <DropdownContextProvider>
        {isShowDropdown &&
          createPortal(
            <DropdownItemList onClose={handleClose} ref={dropDownRef}>
              {children}
            </DropdownItemList>,
            floatingElement,
          )}
      </DropdownContextProvider>
    </>
  );
}

export { Dropdown };
export default Dropdown;
