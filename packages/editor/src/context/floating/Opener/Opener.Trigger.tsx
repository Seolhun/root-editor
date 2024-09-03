import { useMergeRefs } from '@floating-ui/react';
import clsx from 'clsx';
import * as React from 'react';

import { useOpenerContext } from './useOpenerContext';

type ElementType = HTMLButtonElement;
type ElementProps = React.ButtonHTMLAttributes<ElementType>;

export const OpenerTrigger = React.forwardRef<ElementType, ElementProps>(({ className, children, ...props }, ref) => {
  const contextValues = useOpenerContext();
  const childrenRef = (children as any)?.ref;
  const mergedRef = useMergeRefs([contextValues?.refs.setReference, ref, childrenRef]);

  return (
    <button
      {...props}
      className={clsx(className, 'Opener__Trigger')}
      data-state={contextValues?.open ? 'open' : 'closed'}
      ref={mergedRef}
      type="button"
      {...contextValues?.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});
