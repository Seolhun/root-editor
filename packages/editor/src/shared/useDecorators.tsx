import type { LexicalEditor, NodeKey } from 'lexical';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { useIsoMorphicEffect } from './useIsoMorphicEffect';

type ErrorBoundaryProps = {
  children: JSX.Element;
  onError: (error: Error) => void;
};

export type ErrorBoundaryType = React.ComponentClass<ErrorBoundaryProps> | React.FC<ErrorBoundaryProps>;

export function useDecorators(editor: LexicalEditor, ErrorBoundary: ErrorBoundaryType): Array<JSX.Element> {
  const [decorators, setDecorators] = React.useState<Record<NodeKey, JSX.Element>>(() =>
    editor.getDecorators<JSX.Element>(),
  );

  useIsoMorphicEffect(() => {
    return editor.registerDecoratorListener<JSX.Element>((nextDecorators) => {
      ReactDOM.flushSync(() => {
        setDecorators(nextDecorators);
      });
    });
  }, [editor]);

  React.useEffect(() => {
    // If the content editable mounts before the subscription is added, then
    // nothing will be rendered on initial pass. We can get around that by
    // ensuring that we set the value.
    setDecorators(editor.getDecorators());
  }, [editor]);

  // Return decorators defined as React Portals
  return React.useMemo(() => {
    const decoratedPortals: React.ReactPortal[] = [];
    const decoratorKeys = Object.keys(decorators);

    for (let i = 0; i < decoratorKeys.length; i++) {
      const nodeKey = decoratorKeys[i];
      const ReactDecoratorElement = (
        <ErrorBoundary onError={(e) => editor._onError(e)}>
          <React.Suspense fallback={null}>{decorators[nodeKey]}</React.Suspense>
        </ErrorBoundary>
      );
      const NodeElement = editor.getElementByKey(nodeKey);

      if (NodeElement !== null) {
        const Portal = ReactDOM.createPortal(ReactDecoratorElement, NodeElement, nodeKey);
        decoratedPortals.push(Portal);
      }
    }

    return decoratedPortals;
  }, [ErrorBoundary, decorators, editor]);
}
