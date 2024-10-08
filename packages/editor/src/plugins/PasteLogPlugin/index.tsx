import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_NORMAL, PASTE_COMMAND } from 'lexical';
import * as React from 'react';
import { useEffect, useState } from 'react';

export function PasteLogPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isActive, setIsActive] = useState(false);
  const [lastClipboardData, setLastClipboardData] = useState<null | string>(null);
  useEffect(() => {
    if (isActive) {
      return editor.registerCommand(
        PASTE_COMMAND,
        (e: ClipboardEvent) => {
          const { clipboardData } = e;
          const allData: string[] = [];
          if (clipboardData && clipboardData.types) {
            clipboardData.types.forEach((type) => {
              allData.push(type.toUpperCase(), clipboardData.getData(type));
            });
          }
          setLastClipboardData(allData.join('\n\n'));
          return false;
        },
        COMMAND_PRIORITY_NORMAL,
      );
    }
    return undefined;
  }, [editor, isActive]);
  return (
    <>
      <button
        onClick={() => {
          setIsActive(!isActive);
        }}
        className={`editor-dev-button ${isActive ? 'active' : ''}`}
        id="paste-log-button"
        title={isActive ? 'Disable paste log' : 'Enable paste log'}
        type="button"
      />
      {isActive && lastClipboardData !== null ? <pre>{lastClipboardData}</pre> : null}
    </>
  );
}
