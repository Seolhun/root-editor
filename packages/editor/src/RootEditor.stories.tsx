import type { Meta, StoryObj } from '@storybook/react';

import { map, pipe, slice, toArray } from '@fxts/core';
import * as React from 'react';

import { EditorOnChangeFn } from './Editor.types';
import { RootEditor } from './RootEditor';
import { FetchMentionOptionsFn, MentionOption } from './plugins/MentionPlugin';
import { dummyContent, dummyMentions, titleTemplate } from './stories';

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

    return <RootEditor onChangeEditorState={onChangeEditorState} />;
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

export const TemplateExample: Story = {
  render: () => {
    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      console.log(JSON.stringify(editorState.toJSON(), null, 2));
    };

    return (
      <RootEditor
        initialConfigType={{
          editorState: JSON.stringify(titleTemplate),
        }}
        initialSettings={{
          debug: true,
          showTreeView: true,
        }}
        onChangeEditorState={onChangeEditorState}
      />
    );
  },
};

const mentionSearch = async (value: string) => {
  return new Promise<string[]>((resolve) => {
    return setTimeout(() => {
      const results = dummyMentions.filter((mention) => {
        return mention.toLowerCase().includes(value.toLowerCase());
      });
      resolve(results);
    }, 500);
  });
};

const createMentionOptions = (mentionStrings: string[]) => {
  return pipe(
    mentionStrings,
    map((result) => new MentionOption(result, <i className="icon user" />)),
    slice(0, 5),
    toArray,
  );
};

export const PluginPropsExample: Story = {
  render: function PluginEditor() {
    const getMentions: FetchMentionOptionsFn = async (mentionString) => {
      if (mentionString === null) {
        return [];
      }

      const mentions = await mentionSearch(mentionString);
      return createMentionOptions(mentions);
    };

    const onChangeEditorState: EditorOnChangeFn = (editorState) => {
      console.log(JSON.stringify(editorState.toJSON(), null, 2));
    };

    return (
      <RootEditor
        initialConfigType={{
          editorState: JSON.stringify(titleTemplate),
        }}
        initialPluginFunctions={{
          mention: {
            fetchMentionOptions: getMentions,
          },
        }}
        initialSettings={{
          debug: true,
          showTreeView: true,
        }}
        onChangeEditorState={onChangeEditorState}
      />
    );
  },
};
