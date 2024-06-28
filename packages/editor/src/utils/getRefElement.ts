import { ElementRef } from '~/types';

export const getRefElement = <E extends HTMLElement>(refElement: ElementRef<E>): E | null => {
  if (!refElement) {
    return null;
  }
  if ('current' in refElement) {
    return refElement.current;
  }
  return refElement;
};
