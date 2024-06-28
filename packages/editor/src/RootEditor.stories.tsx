import type { Meta, StoryObj } from '@storybook/react';

import * as React from 'react';

import { EditorOnChangeFn } from './Editor.types';
import { RootEditor } from './RootEditor';
import { dummyContent } from './stories';

const meta: Meta<typeof RootEditor> = {
  component: RootEditor,
  title: 'RootEditor',
};

export default meta;
type Story = StoryObj<typeof RootEditor>;

export const PlainEditor: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      console.log(JSON.stringify(editorState.toJSON(), null, 2));
    };

    return (
      <RootEditor
        initialSettings={{
          isRichText: false,
        }}
        onChangeEditorState={onChangeEditorState}
      />
    );
  },
};

export const RichEditor: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      console.log(JSON.stringify(editorState.toJSON(), null, 2));
    };

    return <RootEditor initialConfigType={{}} onChangeEditorState={onChangeEditorState} />;
  },
};

export const WithInitialConfigType: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      console.log(JSON.stringify(editorState.toJSON(), null, 2));
    };

    return (
      <RootEditor
        initialConfigType={{
          editorState: JSON.stringify(dummyContent),
        }}
        onChangeEditorState={onChangeEditorState}
      />
    );
  },
};

export const WidthMaxLength: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      console.log(JSON.stringify(editorState.toJSON(), null, 2));
    };

    return (
      <RootEditor
        initialConfigType={{
          editorState: JSON.stringify(dummyContent),
        }}
        maxLength={10}
        onChangeEditorState={onChangeEditorState}
      />
    );
  },
};

export const WidthInitialSettings: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      console.log(JSON.stringify(editorState.toJSON(), null, 2));
    };

    return (
      <RootEditor
        initialSettings={{
          debug: true,
          showTreeView: true,
        }}
        initialConfigType={{}}
        onChangeEditorState={onChangeEditorState}
      />
    );
  },
};
