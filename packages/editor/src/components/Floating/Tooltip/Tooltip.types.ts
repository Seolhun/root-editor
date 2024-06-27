import { Placement, useFloating, useInteractions } from '@floating-ui/react';

export interface TooltipOptions {
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placement?: Placement;
  /**
   * Portal target element
   */
  root?: HTMLElement | null;
}

export type TooltipIntersectionReturns = ReturnType<typeof useInteractions>;

export type TooltipFloatingReturns = ReturnType<typeof useFloating>;
