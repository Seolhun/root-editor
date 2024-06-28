import { SerializedEditorState } from 'lexical';

import { RootEditorTemplate } from './Templates.types';

export const TEMPLATES = {
  empty: {
    root: {
      type: 'root',
      children: [],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  },
  title: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [],
          direction: null,
          format: '',
          indent: 0,
          tag: 'h1',
          version: 1,
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  },
} as const as Record<RootEditorTemplate, SerializedEditorState<any>>;
