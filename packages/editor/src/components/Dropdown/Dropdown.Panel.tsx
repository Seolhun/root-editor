import React from 'react';

import { Opener, useOpenerContext } from '~/context/floating';

import { useDropdownContext } from './Dropdown.Context';

type ElementType = HTMLDivElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export const DropdownPanel = React.forwardRef<ElementType, ElementProps>(
  ({ children, onKeyDown, ...others }, ref): JSX.Element => {
    const [highlightedItem, setHighlightedItem] = React.useState<React.RefObject<HTMLButtonElement>>();

    const { setOpen } = useOpenerContext();
    const { items } = useDropdownContext();

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<ElementType>) => {
        if (!items) return;

        const { key } = e;
        const behaviorKeys = ['Escape', 'ArrowUp', 'ArrowDown', 'Tab'];
        if (behaviorKeys.includes(key)) {
          e.preventDefault();
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
        onKeyDown?.(e);
      },
      [items, onKeyDown, setOpen],
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
      <Opener.Content>
        <div {...others} className="dropdown" onKeyDown={handleKeyDown} ref={ref} role="menubar" tabIndex={0}>
          {children}
        </div>
      </Opener.Content>
    );
  },
);
