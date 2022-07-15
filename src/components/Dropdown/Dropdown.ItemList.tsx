import React from 'react';

export interface DropdownItemListProps {
  children: React.ReactNode;
  dropDownRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
}

export interface DropdownItemProps {
  children: React.ReactNode;
  className: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
}

type DropdownContextType = {
  registerItem: (ref: React.RefObject<HTMLButtonElement>) => void;
};

const DropdownContext = React.createContext<DropdownContextType | null>(null);

function DropdownItem({
  children,
  className,
  onClick,
  title,
}: DropdownItemProps): JSX.Element {
  const ref = React.useRef<HTMLButtonElement>(null);

  const dropDownContext = React.useContext(DropdownContext);

  if (dropDownContext === null) {
    throw new Error('DropdownItem must be used within a Dropdown');
  }

  const { registerItem } = dropDownContext;

  React.useEffect(() => {
    if (ref && ref.current) {
      registerItem(ref);
    }
  }, [ref, registerItem]);

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      ref={ref}
      title={title}
    >
      {children}
    </button>
  );
}

function DropdownItemList({
  children,
  dropDownRef,
  onClose,
}: DropdownItemListProps): JSX.Element {
  const [items, setItems] =
    React.useState<React.RefObject<HTMLButtonElement>[]>();
  const [highlightedItem, setHighlightedItem] =
    React.useState<React.RefObject<HTMLButtonElement>>();

  const registerItem = React.useCallback(
    (itemRef: React.RefObject<HTMLButtonElement>) => {
      setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]));
    },
    [setItems],
  );

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

  const contextValue = React.useMemo(
    () => ({
      registerItem,
    }),
    [registerItem],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        ref={dropDownRef}
        role="menubar"
        className="dropdown"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export { DropdownItemList, DropdownItem };
export default DropdownItemList;
