import { FloatingPortal, useDelayGroup, useMergeRefs } from '@floating-ui/react';
import { useId } from '@seolhun/root-ui';
import clsx from 'clsx';
import * as React from 'react';

import { useOpenerContext } from './useOpenerContext';

type ElementType = HTMLElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export interface OpenerContentProps extends ElementProps {}

export const OpenerContent = React.forwardRef<ElementType, OpenerContentProps>(
  ({ className, children, ...others }, ref) => {
    const contextValues = useOpenerContext();
    const tooltipId = useId();

    const mergedRef = useMergeRefs([contextValues?.refs.setFloating || null, ref]);

    useDelayGroup(contextValues.context, {
      id: tooltipId,
    });

    const { root, zIndex } = contextValues;
    return (
      <FloatingPortal root={contextValues.root}>
        {contextValues?.open && (
          <div
            {...contextValues?.getFloatingProps(others)}
            style={{
              ...others.style,
              left: contextValues?.x ?? 0,
              position: contextValues?.strategy,
              top: contextValues?.y ?? 0,
              visibility: contextValues?.x == null ? 'hidden' : 'visible',
              zIndex: zIndex ?? 1e7,
            }}
            className={clsx(className)}
            ref={mergedRef}
          >
            {children}
          </div>
        )}
      </FloatingPortal>
    );
  },
);
