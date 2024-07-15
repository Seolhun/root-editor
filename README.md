# root-editor

[![Publish Artifacts at Github Packages](https://github.com/Seolhun/root-editor/actions/workflows/tag-publish.yml/badge.svg?branch=main)](https://github.com/Seolhun/root-editor/actions/workflows/tag-publish.yml)

RootEditor with lexical and tailwind

## Requirements

```sh
pnpm add @seolhun/root-editor @seolhun/root-ui @seolhun/root-ui-tailwind
```

### Set Tailwind Config

```js
import RootUITailwindConfigs from '@seolhun/root-ui-tailwind';

/** @type {import('tailwindcss').Config} */
const config = {
  // ... Your Tailwind Config

  plugins: [
    ...RootUITailwindConfigs,
 ],
};

export default config;
```

### Import Tailwind and Root-UI CSS

```tsx
import './tailwind.css';
import '@seolhun/root-editor/modern/index.css';
import '@seolhun/root-ui/modern/index.css';
```

### Import Root-Editor

Current Root-Editor is not support SSR, so you should use `use client` in your page.

```tsx
'use client';

import { EditorOnChangeFn, RootEditor } from '@seolhun/root-editor';
import { NextPage } from 'next';
import * as React from 'react';

const Page: NextPage = () => {
  const [editorState, setEditorState] = React.useState<string>('');

  const onChangeEditorState: EditorOnChangeFn = (editorState) => {
    const json = JSON.stringify(editorState.toJSON());
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

export default Page;
```

### nvm

```bash
brew install nvm
nvm use
```

### pnpm

```bash
npm install -g pnpm
```

---

## How to run

### Dev (with Storybook)

```bash
pnpm run storybook
```

### Build (with Storybook)

```bash
pnpm run storybook:build
```

### Production

```bash
pnpm run build
```

### Test

```bash
pnpm run test
```

#### Lint

```bash
pnpm run lint
pnpm run lint:fix
```

#### Prettier

```bash
pnpm run prettier
```
