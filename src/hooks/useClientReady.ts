import * as React from 'react';

export function useClientReady() {
  const [isClientReady, setClientReady] = React.useState(false);

  React.useEffect(() => {
    setClientReady(true);
  }, []);

  return isClientReady;
}
