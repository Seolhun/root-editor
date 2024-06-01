import React from 'react';

import { Editor, EditorProps } from './Editor';

export default {
  component: Editor,
  title: 'RootEditor',
};

const Editors: React.FC<EditorProps> = ({ ...rests }) => {
  return <Editor {...rests} />;
};

export const EditorsStories = Editors.bind({});
EditorsStories.args = {};
