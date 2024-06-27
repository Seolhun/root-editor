import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import * as React from 'react';

import { TooltipFloatingReturns, TooltipIntersectionReturns, TooltipOptions } from './Tooltip.types';

export interface UseTooltipProps extends TooltipOptions {
  disabled?: boolean;
}

export interface UseTooltipReturns extends TooltipFloatingReturns, TooltipIntersectionReturns {
  /**
   * Open state
   */
  open: boolean;
  /**
   * Portal target element
   */
  root?: HTMLElement | null;
  /**
   * Set open state
   */
  setOpen: (open: boolean) => void;
  /**
   * zIndex
   */
  zIndex?: number;
}

export function useTooltip({
  disabled,
  initialOpen = false,
  onOpenChange: setControlledOpen,
  open: controlledOpen,
  placement = 'bottom-start',
  root,
  zIndex,
}: UseTooltipProps = {}): UseTooltipReturns {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const floatingData = useFloating({
    middleware: [
      offset(5),
      flip(),
      shift({
        padding: 5,
      }),
    ],
    onOpenChange: setOpen,
    open,
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  const { context } = floatingData;

  const click = useClick(context, {
    enabled: !disabled,
  });
  const focus = useFocus(context, {
    enabled: !disabled,
  });
  const dismiss = useDismiss(context, {
    enabled: !disabled,
  });
  const role = useRole(context, {
    enabled: !disabled,
    role: 'tooltip',
  });

  const interactionValues = useInteractions([focus, click, dismiss, role]);

  return React.useMemo<UseTooltipReturns>(() => {
    return {
      open,
      root,
      setOpen,
      zIndex,
      ...interactionValues,
      ...floatingData,
    };
  }, [open, root, setOpen, zIndex, interactionValues, floatingData]);
}

export type TooltipContextValues = UseTooltipReturns;
export const TooltipContext = React.createContext<TooltipContextValues>(null as unknown as TooltipContextValues);

export const useTooltipContext = (): TooltipContextValues => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }
  return context;
};
