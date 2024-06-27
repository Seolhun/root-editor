import type { Meta, StoryObj } from '@storybook/react';

import * as React from 'react';

import { RootReadonlyEditor } from './RootReadonlyEditor';
import { dummyContent } from './stories';

const meta: Meta<typeof RootReadonlyEditor> = {
  component: RootReadonlyEditor,
  title: 'RootReadonlyEditor',
};

export default meta;
type Story = StoryObj<typeof RootReadonlyEditor>;

export const Default: Story = {
  render: () => {
    return (
      <RootReadonlyEditor
        initialConfigType={{
          editorState: JSON.stringify(dummyContent),
        }}
      />
    );
  },
};

export const WidthMaxLength: Story = {
  render: () => {
    return (
      <RootReadonlyEditor
        initialConfigType={{
          editorState: JSON.stringify(dummyContent),
        }}
        maxLength={10}
      />
    );
  },
};

export const WithInitialConfigType: Story = {
  render: () => {
    return (
      <RootReadonlyEditor
        initialConfigType={{
          editorState: JSON.stringify(dummyContent),
        }}
      />
    );
  },
};

export const WidthInitialSettings: Story = {
  render: () => {
    return (
      <RootReadonlyEditor
        initialConfigType={{
          editorState: JSON.stringify(dummyContent),
        }}
        initialSettings={{ showTreeView: true }}
      />
    );
  },
};
