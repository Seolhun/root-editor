import * as React from 'react';

import { useSuspenseImage } from './useSuspenseImage';

type ElementType = HTMLImageElement;

export interface LazyImageProps {
  altText: string;
  className: null | string;
  height: 'inherit' | number;
  imageRef: React.RefObject<ElementType>;
  maxWidth: number;
  onError: () => void;
  src: string;
  width: 'inherit' | number;
}

export function LazyImage({
  className,
  altText,
  height,
  imageRef,
  maxWidth,
  onError,
  src,
  width,
}: LazyImageProps): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      style={{
        height,
        maxWidth,
        width,
      }}
      alt={altText}
      className={className || undefined}
      draggable="false"
      onError={onError}
      ref={imageRef}
      src={src}
    />
  );
}
