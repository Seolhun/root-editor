import type { LexicalCommand, LexicalEditor } from 'lexical';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import clsx from 'clsx';
import { createCommand } from 'lexical';
import * as React from 'react';

import { createWebsocketProvider } from '~/collaboration';
import { useSharedHistoryContext } from '~/context/SharedHistoryContext';
import { useI18n } from '~/context/i18n';
import { useSettings } from '~/context/settings';
import EmojisPlugin from '~/plugins/EmojisPlugin';
import KeywordsPlugin from '~/plugins/KeywordsPlugin';
import LinkPlugin from '~/plugins/LinkPlugin';
import TreeViewPlugin from '~/plugins/TreeViewPlugin';
import ContentEditable from '~/ui/ContentEditable';
import Placeholder from '~/ui/Placeholder';

import './ImageCaption.scss';

const CLASSNAME = 'ImageNode__Caption';

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = createCommand('RIGHT_CLICK_IMAGE_COMMAND');

export interface ImageCaptionProps {
  caption: LexicalEditor;
}

export function ImageCaption({ caption }: ImageCaptionProps): JSX.Element {
  const { isCollabActive } = useCollaborationContext();

  const { t } = useI18n();

  const { historyState } = useSharedHistoryContext();
  const {
    settings: { showNestedEditorTreeView },
  } = useSettings();

  return (
    <div className={clsx(CLASSNAME)}>
      <LexicalNestedComposer initialEditor={caption}>
        <AutoFocusPlugin />
        <LinkPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        {isCollabActive ? (
          <CollaborationPlugin id={caption.getKey()} providerFactory={createWebsocketProvider} shouldBootstrap={true} />
        ) : (
          <HistoryPlugin externalHistoryState={historyState} />
        )}
        <RichTextPlugin
          contentEditable={<ContentEditable className="ContentEditable" />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={<Placeholder className="Placeholder">{t('plugins.image.caption.placeholder')}</Placeholder>}
        />
        {showNestedEditorTreeView === true ? <TreeViewPlugin /> : null}
      </LexicalNestedComposer>
    </div>
  );
}
