import type { LexicalCommand, LexicalEditor } from 'lexical';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { mergeRegister } from '@lexical/utils';
import clsx from 'clsx';
import { $getRoot, createCommand } from 'lexical';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { EditorClasses } from '~/Editor.theme';
import { createWebsocketProvider } from '~/collaboration';
import { useSettings } from '~/context/settings';
import { useSharedHistoryContext } from '~/context/shared-history';
import { EmojisPlugin } from '~/plugins/EmojisPlugin';
import { LinkPlugin } from '~/plugins/LinkPlugin';
import { TreeViewPlugin } from '~/plugins/TreeViewPlugin';
import { ContentEditable } from '~/ui/ContentEditable';
import { Placeholder } from '~/ui/Placeholder';

import './ImageCaption.scss';

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = createCommand('RIGHT_CLICK_IMAGE_COMMAND');

export interface ImageCaptionProps {
  caption: LexicalEditor;
}

export function ImageCaption({ caption }: ImageCaptionProps): JSX.Element {
  const [captionTextSize, setCaptionTextSize] = React.useState(0);
  const { isCollabActive } = useCollaborationContext();
  const { historyState } = useSharedHistoryContext();
  const {
    settings: { showNestedEditorTreeView },
  } = useSettings();
  const { t } = useTranslation();

  const onClearCaption = React.useCallback(() => {
    caption.update(() => {
      const root = $getRoot();
      root.clear();
    });
  }, [caption]);

  React.useEffect(() => {
    const unregister = mergeRegister(
      caption.registerTextContentListener((textContent) => {
        setCaptionTextSize(textContent.length);
      }),
    );
    return () => {
      unregister();
    };
  }, [caption]);

  return (
    <div className={clsx(EditorClasses.imageCaption)}>
      <LexicalNestedComposer initialEditor={caption}>
        <AutoFocusPlugin />
        <LinkPlugin />
        <EmojisPlugin />
        <ClearEditorPlugin />
        {isCollabActive ? (
          <CollaborationPlugin id={caption.getKey()} providerFactory={createWebsocketProvider} shouldBootstrap={true} />
        ) : (
          <HistoryPlugin externalHistoryState={historyState} />
        )}
        <div className={clsx('flex items-start justify-between', 'p-2')}>
          <PlainTextPlugin
            contentEditable={<ContentEditable className="ContentEditable" />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={<Placeholder className="Placeholder">{t('plugins.image.caption.placeholder')}</Placeholder>}
          />
          {captionTextSize > 0 && (
            <XCircleIcon
              className={clsx('size-8', 'mt-2', 'text-neutral-3 dark:text-neutral-7', 'cursor-pointer')}
              onClick={onClearCaption}
            />
          )}
        </div>
        {showNestedEditorTreeView === true ? <TreeViewPlugin /> : null}
      </LexicalNestedComposer>
    </div>
  );
}
