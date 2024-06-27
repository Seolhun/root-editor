import * as React from 'react';

export type FloatingAreaContextValues<E extends HTMLElement = HTMLElement> = {
  floatingElement: E | null;
};

export const FloatingAreaContext = React.createContext(null as unknown as FloatingAreaContextValues);

export interface FloatingAreaProps {
  children: React.ReactNode;
}

export const FloatingAreaProvider = ({ children }: FloatingAreaProps) => {
  const [floatingElement, setFloatingElement] = React.useState<HTMLElement | null>(null);

  const contextValues = React.useMemo(() => ({ floatingElement }), [floatingElement]);

  return (
    <FloatingAreaContext.Provider value={contextValues}>
      {children}
      <div id="floating-area" ref={setFloatingElement} />
    </FloatingAreaContext.Provider>
  );
};

export const useFloatingAreaContext = () => {
  const context = React.useContext(FloatingAreaContext);
  if (context == null) {
    throw new Error('FloatingArea components must be wrapped in <FloatingArea />');
  }
  return context;
};
