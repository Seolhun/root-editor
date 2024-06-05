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
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {};
    return <RootEditor maxLength={10} onChangeEditorState={onChangeEditorState} />;
  },
};
