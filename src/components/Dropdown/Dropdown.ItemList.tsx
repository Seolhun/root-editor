import React from 'react';
import { useDropdownContext } from './Dropdown.Context';

export interface DropdownItemListProps {
  children: React.ReactNode;
  onClose: () => void;
}

const DropdownItemList = React.forwardRef<HTMLDivElement, DropdownItemListProps>(
  ({ children, onClose }, ref): JSX.Element => {
    const [highlightedItem, setHighlightedItem] = React.useState<React.RefObject<HTMLButtonElement>>();

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
            onClose();
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
      [items, onClose],
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
      <div ref={ref} role="menubar" className="dropdown" onKeyDown={handleKeyDown} tabIndex={0}>
        {children}
      </div>
    );
  },
);

export { DropdownItemList };
export default DropdownItemList;
