import {
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

import { OpenerFloatingReturns, OpenerIntersectionReturns, OpenerOptions } from './Opener.types';

export interface UseOpenerProps extends OpenerOptions {
  disabled?: boolean;
}

export interface UseOpenerReturns extends OpenerFloatingReturns, OpenerIntersectionReturns {
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

export function useOpener({
  disabled,
  initialOpen = false,
  onOpenChange: setControlledOpen,
  open: controlledOpen,
  placement = 'bottom-start',
  root,
  zIndex,
}: UseOpenerProps = {}): UseOpenerReturns {
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

  return React.useMemo<UseOpenerReturns>(() => {
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

export type OpenerContextValues = UseOpenerReturns;
export const OpenerContext = React.createContext<OpenerContextValues>(null as unknown as OpenerContextValues);

export const useOpenerContext = (): OpenerContextValues => {
  const context = React.useContext(OpenerContext);

  if (context == null) {
    throw new Error('Opener components must be wrapped in <Opener />');
  }
  return context;
};
