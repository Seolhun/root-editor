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

export const Default: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      const json = editorState.toJSON();
      console.debug(JSON.stringify(json, null, 2));
    };
    return <RootEditor onChangeEditorState={onChangeEditorState} />;
  },
};

export const WidthMaxLength: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {};
    return <RootEditor maxLength={10} onChangeEditorState={onChangeEditorState} />;
  },
};

export const WithInitialConfigType: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {};
    return (
      <RootEditor
        initialConfigType={{
          editorState: JSON.stringify({
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Hello World! Welcome to RootEditor!',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          }),
        }}
        onChangeEditorState={onChangeEditorState}
      />
    );
  },
};

export const WidthInitialSettings: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {};
    return <RootEditor initialSettings={{ showTreeView: true }} onChangeEditorState={onChangeEditorState} />;
  },
};
