import { Placement, Strategy, useFloating, useInteractions } from '@floating-ui/react';

import { ElementRef } from '~/types';

export type OpenerDelay = {
  close: number;
  open: number;
};

export type OpenerInteraction = 'click' | 'focus' | 'hover';
export interface OpenerOptions {
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
   * Opener placement
   * @default 'bottom-start'
   */
  placement?: Placement;
  /**
   * Portal target element
   */
  root?: ElementRef<HTMLElement>;
  /**
   * Opener strategy
   */
  strategy?: Strategy;
  /**
   * Z-index of tooltip content
   */
  zIndex?: number;
}

export type OpenerIntersectionReturns = ReturnType<typeof useInteractions>;

export type OpenerFloatingReturns = ReturnType<typeof useFloating>;
