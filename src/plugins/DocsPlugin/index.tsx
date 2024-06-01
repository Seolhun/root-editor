import * as React from 'react';

export default function DocsPlugin(): JSX.Element {
  return (
    <a href="https://lexical.dev/docs/intro" target="__blank">
      <button className="editor-dev-button" id="docs-button" title="Lexical Docs" />
    </a>
  );
}
