'use client';

import { EditorOnChangeFn } from '@seolhun/root-editor';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as React from 'react';

const Editor = dynamic(() => import('@seolhun/root-editor').then((mod) => mod.RootEditor), {
  ssr: false,
});

const HomePage: NextPage = () => {
  const [editorState, setEditorState] = React.useState<string>('');

  const onChangeEditorState: EditorOnChangeFn = (editorState) => {
    const json = JSON.stringify(editorState.toJSON(), null, 2);
    setEditorState(json);
  };

  return (
    <Editor
      initialConfigType={{
        editorState: editorState ? JSON.stringify(editorState) : undefined,
      }}
      onChangeEditorState={onChangeEditorState}
    />
  );
};

export default HomePage;
