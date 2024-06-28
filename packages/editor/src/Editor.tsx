import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import * as React from 'react';

import { createWebsocketProvider } from '~/collaboration';
import { CAN_USE_DOM } from '~/shared/canUseDOM';

import { EditorPlaceholderRenderer } from './Editor.types';
import { FloatingAreaProvider } from './components';
import { useSharedHistoryContext } from './context/SharedHistoryContext';
import { useSettings } from './context/settings/SettingsContext';
import ActionsPlugin from './plugins/ActionsPlugin';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import AutocompletePlugin from './plugins/AutocompletePlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import { CommentPlugin } from './plugins/CommentPlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import ContextMenuPlugin from './plugins/ContextMenuPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import ExcalidrawPlugin from './plugins/ExcalidrawPlugin';
import FigmaPlugin from './plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import { FloatingTextFormatToolbarPlugin } from './plugins/FloatingTextFormatToolbarPlugin';
import { ImagesPlugin } from './plugins/ImagesPlugin';
import { InlineImagePlugin } from './plugins/InlineImagePlugin/InlineImagePlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';
import MentionsPlugin from './plugins/MentionsPlugin';
import PageBreakPlugin from './plugins/PageBreakPlugin';
import PollPlugin from './plugins/PollPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import { TableActionMenuPlugin, TableCellResizerPlugin, TableOfContentsPlugin } from './plugins/TablesPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import TwitterPlugin from './plugins/TwitterPlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';

export interface EditorProps {
  /**
   * Maximum length of the editor.
   */
  maxLength?: number;
  /**
   * Placeholder text to show when the editor is empty.
   */
  placeholder?: EditorPlaceholderRenderer;
}

export function Editor({ maxLength, placeholder }: EditorProps) {
  const skipCollaborationInitRef = React.useRef<boolean>();
  const { historyState } = useSharedHistoryContext();
  const { settings } = useSettings();
  const {
    enabledCommentFeature,
    enabledEmbedFeature,
    enabledEquationFeature,
    enabledExcalidrawFeature,
    enabledFigmaDocumentFeature,
    isAutocomplete,
    isCharLimit,
    isCharLimitUtf8,
    isCollaborative,
    isMaxLength,
    isRichText,
    shouldUseLexicalContextMenu,
    showTableOfContents,
    showTreeView,
    tableCellBackgroundColor,
    tableCellMerge,
  } = settings;

  const isEditable = useLexicalEditable();
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport = CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;
      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);
    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  useEffect(() => {
    // @ts-ignore
    const skipCollaborationInit = window.parent != null && window.parent.frames.right === window;
    skipCollaborationInitRef.current = true;
  }, []);

  const hasMaxLength = maxLength != null && maxLength > 0;
  const canUseFloatingAnchor = !isSmallWidthViewport;
  const PlaceholderMessage = <Placeholder>{placeholder?.(settings)}</Placeholder>;

  return (
    <FloatingAreaProvider
      className={clsx('EditorContainer', {
        PlainText: !isRichText,
        TreeView: showTreeView,
      })}
    >
      {isRichText && <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />}
      {isMaxLength && hasMaxLength && <MaxLengthPlugin maxLength={maxLength} />}
      <DragDropPaste />
      <AutoFocusPlugin />
      <ClearEditorPlugin />
      <ComponentPickerPlugin />
      <EmojiPickerPlugin />
      <AutoEmbedPlugin />
      <MentionsPlugin />
      <EmojisPlugin />
      <HashtagPlugin />
      <KeywordsPlugin />
      <SpeechToTextPlugin />
      <AutoLinkPlugin />
      {enabledCommentFeature && (
        <CommentPlugin providerFactory={isCollaborative ? createWebsocketProvider : undefined} />
      )}
      {isRichText ? (
        <>
          {isCollaborative ? (
            <CollaborationPlugin
              id="main"
              providerFactory={createWebsocketProvider}
              shouldBootstrap={!skipCollaborationInitRef.current}
            />
          ) : (
            <HistoryPlugin externalHistoryState={historyState} />
          )}
          <RichTextPlugin
            contentEditable={
              <div className="EditorScroller">
                <div className="Editor">
                  <ContentEditable />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={PlaceholderMessage}
          />
          <MarkdownShortcutPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <TablePlugin hasCellBackgroundColor={tableCellBackgroundColor} hasCellMerge={tableCellMerge} />
          <TableCellResizerPlugin />
          <ImagesPlugin />
          <InlineImagePlugin />
          <LinkPlugin />
          <PollPlugin />
          <TwitterPlugin />
          <YouTubePlugin />
          {enabledEquationFeature && <EquationsPlugin />}
          {enabledExcalidrawFeature && <ExcalidrawPlugin />}
          {enabledFigmaDocumentFeature && <FigmaPlugin />}
          {enabledEmbedFeature && <AutoEmbedPlugin />}

          <ClickableLinkPlugin disabled={isEditable} />
          <HorizontalRulePlugin />
          <TabFocusPlugin />
          <TabIndentationPlugin />
          <CollapsiblePlugin />
          <PageBreakPlugin />
          <LayoutPlugin />
          {canUseFloatingAnchor && (
            <>
              <DraggableBlockPlugin />
              <CodeActionMenuPlugin />
              <FloatingLinkEditorPlugin isLinkEditMode={isLinkEditMode} setIsLinkEditMode={setIsLinkEditMode} />
              <TableActionMenuPlugin cellMerge={true} />
              <FloatingTextFormatToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
            </>
          )}
        </>
      ) : (
        <>
          <PlainTextPlugin
            contentEditable={<ContentEditable />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={PlaceholderMessage}
          />
          <HistoryPlugin externalHistoryState={historyState} />
        </>
      )}
      {(isCharLimit || isCharLimitUtf8) && hasMaxLength && (
        <CharacterLimitPlugin charset={isCharLimit ? 'UTF-16' : 'UTF-8'} maxLength={maxLength} />
      )}
      {isAutocomplete && <AutocompletePlugin />}
      <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
      {shouldUseLexicalContextMenu && <ContextMenuPlugin />}
      <ActionsPlugin />
      {showTreeView && <TreeViewPlugin />}
    </FloatingAreaProvider>
  );
}
