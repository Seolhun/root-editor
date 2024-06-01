import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';
import React from 'react';

const TreeViewPlugin = (): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      editor={editor}
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      viewClassName="tree-view-output"
    />
  );
};

export { TreeViewPlugin };
export default TreeViewPlugin;
