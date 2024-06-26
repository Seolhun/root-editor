import * as React from 'react';

import brokenImage from '~/assets/image-broken.svg';

export function BrokenImage(): JSX.Element {
  return (
    <img
      style={{
        height: 200,
        opacity: 0.2,
        width: 200,
      }}
      draggable="false"
      src={brokenImage}
    />
  );
}
