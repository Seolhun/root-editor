import * as React from 'react';
import { createContext, ReactNode, useContext, useMemo } from 'react';

import { ExternalImagePluginProps } from '~/plugins/ImagesPlugin';
import { ExternalMentionPluginProps } from '~/plugins/MentionPlugin';

export interface EditorPluginFunctionsContextContextValues {
  image: ExternalImagePluginProps;
  mention: ExternalMentionPluginProps;
}

export const EditorPluginFunctionsContextContext = createContext(
  null as unknown as EditorPluginFunctionsContextContextValues,
);

export interface EditorPluginFunctionsContextProviderProps {
  children: ReactNode;
  initialPluginFunctions?: Partial<EditorPluginFunctionsContextContextValues>;
}

export const EditorPluginFunctionsContextProvider = ({
  children,
  initialPluginFunctions,
}: EditorPluginFunctionsContextProviderProps): JSX.Element => {
  const contextValue = usePluginFunctions(initialPluginFunctions);

  return (
    <EditorPluginFunctionsContextContext.Provider value={contextValue}>
      {children}
    </EditorPluginFunctionsContextContext.Provider>
  );
};

export function usePluginFunctions(initialPluginFunctions?: Partial<EditorPluginFunctionsContextContextValues>) {
  const contextValue = useMemo<EditorPluginFunctionsContextContextValues>(() => {
    const functions: EditorPluginFunctionsContextContextValues = {
      image: {
        onImageFileUpload: async (image) => {
          if (typeof image === 'string') {
            return {
              altText: 'image',
              src: image,
            };
          }
          return {
            altText: image.name,
            src: URL.createObjectURL(image),
          };
        },
        ...initialPluginFunctions?.image,
      },
      mention: {
        fetchMentionOptions: async () => {
          return [];
        },
        ...initialPluginFunctions?.mention,
      },
    };
    return functions;
  }, [initialPluginFunctions]);

  return contextValue;
}

export function useEditorPluginFunctionsContext() {
  return useContext(EditorPluginFunctionsContextContext);
}
