'use client';

import { EditorOnChangeFn, RootEditor } from '@seolhun/root-editor';
import { NextPage } from 'next';
import * as React from 'react';

const HomePage: NextPage = () => {
  const [editorState, setEditorState] = React.useState<string>('');

  const onChangeEditorState: EditorOnChangeFn = (editorState) => {
    const json = JSON.stringify(editorState.toJSON(), null, 2);
    setEditorState(json);
  };

  return (
    <RootEditor
      initialConfigType={{
        editorState: editorState ? JSON.stringify(editorState) : undefined,
      }}
      onChangeEditorState={onChangeEditorState}
    />
  );
};

export default HomePage;
