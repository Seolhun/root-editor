import { Placement, useFloating, useInteractions } from '@floating-ui/react';

export type TooltipDelay = {
  close: number;
  open: number;
};

export type TooltipInteraction = 'click' | 'focus' | 'hover';
export interface TooltipOptions {
  /**
   * Initial open state
   */
  initialOpen?: boolean;
  /**
   * Callback to handle open state
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Controlled open state
   */
  open?: boolean;
  /**
   * Tooltip placement
   * @default 'bottom-start'
   */
  placement?: Placement;
  /**
   * Portal target element
   */
  root?: HTMLElement | null;
  /**
   * Z-index of tooltip content
   */
  zIndex?: number;
}

export type TooltipIntersectionReturns = ReturnType<typeof useInteractions>;

export type TooltipFloatingReturns = ReturnType<typeof useFloating>;
