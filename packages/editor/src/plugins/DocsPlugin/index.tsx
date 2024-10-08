import * as React from 'react';

export function DocsPlugin(): JSX.Element {
  return (
    <a href="https://lexical.dev/docs/intro" target="__blank">
      <button className="editor-dev-button" id="docs-button" title="Lexical Docs" type="button" />
    </a>
  );
}
