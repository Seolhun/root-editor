import * as React from 'react';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type Suggestion = null | string;
type CallbackFn = (newSuggestion: Suggestion) => void;
type SubscribeFn = (callbackFn: CallbackFn) => () => void;
type PublishFn = (newSuggestion: Suggestion) => void;
type ContextShape = [SubscribeFn, PublishFn];
type HookShape = [suggestion: Suggestion, setSuggestion: PublishFn];

const Context: React.Context<ContextShape> = createContext([
  (_cb) => () => {
    return;
  },
  (_newSuggestion: Suggestion) => {
    return;
  },
]);

export const SharedAutocompleteContext = ({ children }: { children: ReactNode }): JSX.Element => {
  const contextValues = useMemo<ContextShape>(() => {
    let suggestion: null | Suggestion = null;
    const listeners: Set<CallbackFn> = new Set();
    return [
      (cb: (newSuggestion: Suggestion) => void) => {
        cb(suggestion);
        listeners.add(cb);
        return () => {
          listeners.delete(cb);
        };
      },
      (newSuggestion: Suggestion) => {
        suggestion = newSuggestion;
        for (const listener of listeners) {
          listener(newSuggestion);
        }
      },
    ];
  }, []);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useSharedAutocompleteContext = (): HookShape => {
  const [subscribe, publish]: ContextShape = useContext(Context);
  const [suggestion, setSuggestion] = useState<Suggestion>(null);

  useEffect(() => {
    return subscribe((newSuggestion: Suggestion) => {
      setSuggestion(newSuggestion);
    });
  }, [subscribe]);

  return [suggestion, publish];
};
