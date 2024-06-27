import React from 'react';

import { useDropdownContext } from './Dropdown.Context';

export interface DropdownItemProps {
  children: React.ReactNode;
  className: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
}

export function DropdownItem({ className, children, onClick, title }: DropdownItemProps): JSX.Element {
  const ref = React.useRef<HTMLButtonElement>(null);

  const { registerItem } = useDropdownContext();

  React.useEffect(() => {
    if (ref && ref.current) {
      registerItem(ref);
    }
  }, [ref, registerItem]);

  return (
    <button className={className} onClick={onClick} ref={ref} title={title} type="button">
      {children}
    </button>
  );
}
