import { FloatingPortal, useDelayGroup, useDelayGroupContext, useMergeRefs } from '@floating-ui/react';
import { useId, useIsoMorphicEffect } from '@seolhun/root-ui';
import clsx from 'clsx';
import * as React from 'react';

import { useTooltipContext } from './useTooltipContext';

type ElementType = HTMLElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export interface TooltipContentProps extends ElementProps {}

export const TooltipContent = React.forwardRef<ElementType, TooltipContentProps>(
  ({ className, children, ...others }, ref) => {
    const contextValues = useTooltipContext();
    const { setCurrentId } = useDelayGroupContext();
    const tooltipId = useId();

    const mergedRef = useMergeRefs([contextValues?.refs.setFloating || null, ref]);

    useDelayGroup(contextValues.context, {
      id: tooltipId,
    });

    useIsoMorphicEffect(() => {
      if (contextValues.open) {
        setCurrentId(tooltipId);
      }
    }, [contextValues.open, tooltipId, setCurrentId]);

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
              zIndex: 1e7,
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
