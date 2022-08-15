import React from 'react';

export interface DropdownContextProviderProps {
  children: React.ReactNode;
}

export interface DropdownContextValues {
  items: React.RefObject<HTMLButtonElement>[];
  registerItem: (ref: React.RefObject<HTMLButtonElement>) => void;
}

const DropdownContext = React.createContext<DropdownContextValues | null>(null) as React.Context<DropdownContextValues>;

function useDropdown(): DropdownContextValues {
  const [items, setItems] = React.useState<React.RefObject<HTMLButtonElement>[]>([]);

  const registerItem = React.useCallback(
    (itemRef: React.RefObject<HTMLButtonElement>) => {
      setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]));
    },
    [setItems],
  );

  return {
    items,
    registerItem,
  };
}

function useDropdownContext(): DropdownContextValues {
  return React.useContext(DropdownContext);
}

function DropdownContextProvider({ children }: DropdownContextProviderProps): JSX.Element {
  const { items, registerItem } = useDropdown();

  const contextValue = React.useMemo(
    () => ({
      items,
      registerItem,
    }),
    [items, registerItem],
  );

  return <DropdownContext.Provider value={contextValue}>{children}</DropdownContext.Provider>;
}

export { DropdownContextProvider, useDropdownContext };
export default DropdownContextProvider;
