import type { Meta, StoryObj } from '@storybook/react';

import * as React from 'react';

import { EditorOnChangeFn } from './Editor.types';
import { RootEditor } from './RootEditor';

const meta: Meta<typeof RootEditor> = {
  component: RootEditor,
  title: 'RootEditor',
};

export default meta;
type Story = StoryObj<typeof RootEditor>;

export const RootEditorsStories: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      const json = editorState.toJSON();
      console.debug(JSON.stringify(json, null, 2));
    };
    return <RootEditor onChangeEditorState={onChangeEditorState} />;
  },
};
