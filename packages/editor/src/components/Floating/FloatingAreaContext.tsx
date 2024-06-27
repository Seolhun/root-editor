import clsx from 'clsx';
import * as React from 'react';

export type FloatingAreaContextValues<E extends HTMLElement = HTMLElement> = {
  floatingElement: E | null;
};

export const FloatingAreaContext = React.createContext(null as unknown as FloatingAreaContextValues);

type ElementType = HTMLDivElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export const FloatingAreaProvider = ({ className, children, ...others }: ElementProps) => {
  const [floatingElement, setFloatingElement] = React.useState<HTMLElement | null>(null);

  const contextValues = React.useMemo<FloatingAreaContextValues>(() => {
    return {
      floatingElement,
    };
  }, [floatingElement]);

  return (
    <FloatingAreaContext.Provider value={contextValues}>
      <div {...others} className={clsx(className)} ref={setFloatingElement}>
        {children}
      </div>
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
