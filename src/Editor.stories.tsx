import React from 'react';

import { Editor, EditorProps } from './Editor';

export default {
  title: 'RootEditor',
  component: Editor,
};

const Editors: React.FC<EditorProps> = ({ ...rests }) => {
  return <Editor {...rests} />;
};

export const EditorsStories = Editors.bind({});
EditorsStories.args = {};
