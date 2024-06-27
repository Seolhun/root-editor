import * as React from 'react';

import { TooltipOptions } from './Tooltip.types';
import { TooltipContext, useTooltip } from './useTooltipContext';

export interface TooltipProps extends TooltipOptions {
  children: React.ReactNode;
}

export const TooltipRoot = ({ children, ...options }: TooltipProps) => {
  const tooltipValues = useTooltip(options);

  return <TooltipContext.Provider value={tooltipValues}>{children}</TooltipContext.Provider>;
};
