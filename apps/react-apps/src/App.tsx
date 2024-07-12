import { EditorOnChangeFn, RootEditor } from '@seolhun/root-editor';
import React from 'react';

/*eslint-disable */
import '@seolhun/root-editor/modern/index.css';
/*eslint-enable */

function App() {
  const onChangeEditorState: EditorOnChangeFn = (editorState) => {
    console.log(JSON.stringify(editorState.toJSON(), null, 2));
  };

  return (
    <div className="App">
      <RootEditor onChangeEditorState={onChangeEditorState} />
    </div>
  );
}

export default App;
