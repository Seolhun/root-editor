import * as React from 'react';
import { createContext, ReactNode, useContext } from 'react';

import './FloatingAreaContext.scss';

export type FloatingAreaContextValues = {
  floatingElement: HTMLElement | null;
};

const FloatingAreaContext = createContext(null as unknown as FloatingAreaContextValues);

export const FloatingAreaProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [floatingElement, setFloatingElement] = React.useState<HTMLElement | null>(null);

  const contextValues = React.useMemo<FloatingAreaContextValues>(() => ({ floatingElement }), [floatingElement]);
  return (
    <FloatingAreaContext.Provider value={contextValues}>
      <div className="FloatingArea" ref={setFloatingElement}></div>
      <>{children}</>
    </FloatingAreaContext.Provider>
  );
};

export const useFloatingAreaContext = () => {
  return useContext(FloatingAreaContext);
};
