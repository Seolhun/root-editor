import React from 'react';

import { useOpenerContext } from '../Floating';
import { useDropdownContext } from './Dropdown.Context';

export interface DropdownItemListProps {
  children: React.ReactNode;
}

export const DropdownItemList = React.forwardRef<HTMLDivElement, DropdownItemListProps>(
  ({ children }, ref): JSX.Element => {
    const [highlightedItem, setHighlightedItem] = React.useState<React.RefObject<HTMLButtonElement>>();

    const { setOpen } = useOpenerContext();
    const { items } = useDropdownContext();

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!items) return;

        const { key } = event;
        const behaviorKeys = ['Escape', 'ArrowUp', 'ArrowDown', 'Tab'];
        if (behaviorKeys.includes(key)) {
          event.preventDefault();
        }

        switch (key) {
          case 'Tab':
          case 'Escape': {
            setOpen(false);
            break;
          }
          case 'ArrowUp': {
            setHighlightedItem((prev) => {
              if (!prev) return items[0];
              const index = items.indexOf(prev) - 1;
              return items[index === -1 ? items.length - 1 : index];
            });
            break;
          }
          case 'ArrowDown': {
            setHighlightedItem((prev) => {
              if (!prev) return items[0];
              return items[items.indexOf(prev) + 1];
            });
            break;
          }
          default: {
            break;
          }
        }
      },
      [items, setOpen],
    );

    React.useEffect(() => {
      if (items && !highlightedItem) {
        setHighlightedItem(items[0]);
      }
      if (highlightedItem && highlightedItem.current) {
        highlightedItem.current.focus();
      }
    }, [items, highlightedItem]);

    return (
      <div className="dropdown" onKeyDown={handleKeyDown} ref={ref} role="menubar" tabIndex={0}>
        {children}
      </div>
    );
  },
);
