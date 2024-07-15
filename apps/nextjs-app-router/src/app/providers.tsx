'use client';

/*eslint-disable */
import '~/i18n';
import './tailwind.css';
import '@seolhun/root-editor/modern/index.css';
import '@seolhun/root-ui/modern/index.css';
/*eslint-enable */

import * as React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
