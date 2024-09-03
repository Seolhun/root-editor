import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
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
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CAN_USE_DOM } from '~/shared/canUseDOM';
import { ContentEditable } from '~/ui/ContentEditable';

import { EditorClasses } from './Editor.theme';
import { useSettings } from './context/settings';
import { useSharedHistoryContext } from './context/shared-history';
import { ActionsPlugin } from './plugins/ActionsPlugin';
import { AutoEmbedPlugin } from './plugins/AutoEmbedPlugin';
import { AutoLinkPlugin } from './plugins/AutoLinkPlugin';
import { AutocompletePlugin } from './plugins/AutocompletePlugin';
import { CodeActionMenuPlugin } from './plugins/CodeActionMenuPlugin';
import { CodeHighlightPlugin } from './plugins/CodeHighlightPlugin';
import { CollapsiblePlugin } from './plugins/CollapsiblePlugin';
import { ComponentPickerPlugin } from './plugins/ComponentPickerPlugin';
import { ContextMenuPlugin } from './plugins/ContextMenuPlugin';
import { DragDropPastePlugin } from './plugins/DragDropPastePlugin';
import { DraggableBlockPlugin } from './plugins/DraggableBlockPlugin';
import { EmojiPickerPlugin } from './plugins/EmojiPickerPlugin';
import { EmojisPlugin } from './plugins/EmojisPlugin';
import { EquationsPlugin } from './plugins/EquationsPlugin';
import { ExcalidrawPlugin } from './plugins/ExcalidrawPlugin';
import { FigmaPlugin } from './plugins/FigmaPlugin/FigmaPlugin';
import { FloatingLinkEditorPlugin } from './plugins/FloatingLinkEditorPlugin';
import { FloatingTextFormatToolbarPlugin } from './plugins/FloatingTextFormatToolbarPlugin';
import { ExternalImagePluginProps, ImagesPlugin } from './plugins/ImagesPlugin';
import { InlineImagePlugin } from './plugins/InlineImagePlugin/InlineImagePlugin';
import { KeywordsPlugin } from './plugins/KeywordsPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import { LinkPlugin } from './plugins/LinkPlugin';
import { ListMaxIndentLevelPlugin } from './plugins/ListMaxIndentLevelPlugin';
import { MarkdownShortcutPlugin } from './plugins/MarkdownShortcutPlugin';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';
import { ExternalMentionPluginProps, MentionPlugin } from './plugins/MentionPlugin';
import { PageBreakPlugin } from './plugins/PageBreakPlugin';
import { ParagraphPlaceholderPlugin } from './plugins/ParagraphPlaceholderPlugin';
import { PollPlugin } from './plugins/PollPlugin';
import { SpeechToTextPlugin } from './plugins/SpeechToTextPlugin';
import { TabFocusPlugin } from './plugins/TabFocusPlugin';
import { TableActionMenuPlugin, TableCellResizerPlugin, TableOfContentsPlugin } from './plugins/TablesPlugin';
import { TitlePlaceholderPlugin } from './plugins/TitlePlaceholderPlugin';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { TreeViewPlugin } from './plugins/TreeViewPlugin';
import { TwitterPlugin } from './plugins/TwitterPlugin/TwitterPlugin';
import { YouTubePlugin } from './plugins/YouTubePlugin';

export interface EditorProps {
  /**
   * Maximum length of the editor.
   */
  maxLength?: number;
  /**
   * Plugins to use in the editor.
   */
  plugins?: EditorPluginProps;
}

export interface EditorPluginProps {
  image: ExternalImagePluginProps;
  mention: ExternalMentionPluginProps;
}

export function Editor({ maxLength, plugins }: EditorProps) {
  const skipCollaborationInitRef = React.useRef<boolean>();
  const { t } = useTranslation();
  const { historyState } = useSharedHistoryContext();
  const { settings } = useSettings();
  const {
    enabledActionFeature,
    enabledEmbedFeature,
    enabledEquationFeature,
    enabledExcalidrawFeature,
    enabledFigmaDocumentFeature,
    enabledTweeterFeature,
    enabledYoutubeFeature,
    isAutocomplete,
    isCharLimit,
    isCharLimitUtf8,
    isMaxLength,
    isRichText,
    shouldUseLexicalContextMenu,
    showTableOfContents,
    showTreeView,
    tableCellBackgroundColor,
    tableCellMerge,
  } = settings;

  const isEditable = useLexicalEditable();
  const [floatingAnchor, setFloatingAnchor] = useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onFloatingAnchorRef = (element: HTMLDivElement) => {
    if (element !== null) {
      setFloatingAnchor(element);
    }
  };

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
  const canUseFloatingAnchor = floatingAnchor && !isSmallWidthViewport;
  return (
    <div
      className={clsx('EditorContainer', isRichText ? EditorClasses.richText : EditorClasses.plainText, {
        TreeView: showTreeView,
      })}
    >
      {isRichText && <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />}
      {isMaxLength && hasMaxLength && <MaxLengthPlugin maxLength={maxLength} />}
      <DragDropPastePlugin />
      <AutoFocusPlugin />
      <ClearEditorPlugin />
      <EmojisPlugin />
      <HashtagPlugin />
      <KeywordsPlugin />
      <SpeechToTextPlugin />
      <AutoLinkPlugin />
      <ParagraphPlaceholderPlugin hideOnEmptyEditor placeholder={`Press "/" for commands`} />
      <TitlePlaceholderPlugin placeholder={t('editor.title.placeholder') as string} />

      {/* {enabledCommentFeature && (
        <CommentPlugin providerFactory={isCollaborative ? createWebsocketProvider : undefined} />
      )} */}
      {isRichText ? (
        <>
          {/* {isCollaborative ? (
            <CollaborationPlugin
              id="main"
              providerFactory={createWebsocketProvider}
              shouldBootstrap={!skipCollaborationInitRef.current}
            />
          ) : (
            <HistoryPlugin externalHistoryState={historyState} />
          )} */}
          <HistoryPlugin externalHistoryState={historyState} />
          <RichTextPlugin
            contentEditable={
              <div className="EditorScroller" ref={onFloatingAnchorRef}>
                <div className="Editor">
                  <ContentEditable />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={null}
          />
          <MarkdownShortcutPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <TablePlugin hasCellBackgroundColor={tableCellBackgroundColor} hasCellMerge={tableCellMerge} />
          <ImagesPlugin />
          <InlineImagePlugin />
          <LinkPlugin />
          <PollPlugin />

          {enabledEquationFeature && <EquationsPlugin />}
          {enabledExcalidrawFeature && <ExcalidrawPlugin />}
          {enabledFigmaDocumentFeature && <FigmaPlugin />}
          {enabledTweeterFeature && <TwitterPlugin />}
          {enabledYoutubeFeature && <YouTubePlugin />}
          {enabledEmbedFeature && <AutoEmbedPlugin />}

          <ClickableLinkPlugin disabled={isEditable} />
          <HorizontalRulePlugin />
          <TabFocusPlugin />
          <TabIndentationPlugin />
          <CollapsiblePlugin />
          <PageBreakPlugin />
          <LayoutPlugin />
          {/* floatingAnchor is used to position floating components */}
          {canUseFloatingAnchor && (
            <>
              <DraggableBlockPlugin floatingAnchor={floatingAnchor} />
              <CodeActionMenuPlugin floatingAnchor={floatingAnchor} />
              <FloatingLinkEditorPlugin
                floatingAnchor={floatingAnchor}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <TableActionMenuPlugin cellMerge={true} floatingAnchor={floatingAnchor} />
              <FloatingTextFormatToolbarPlugin floatingAnchor={floatingAnchor} setIsLinkEditMode={setIsLinkEditMode} />
              <ComponentPickerPlugin floatingAnchor={floatingAnchor} />
              <EmojiPickerPlugin floatingAnchor={floatingAnchor} />
              <TableCellResizerPlugin floatingAnchor={floatingAnchor} />
              <MentionPlugin {...plugins?.mention} floatingAnchor={floatingAnchor} />
              {shouldUseLexicalContextMenu && <ContextMenuPlugin floatingAnchor={floatingAnchor} />}
            </>
          )}
        </>
      ) : (
        <>
          <PlainTextPlugin
            contentEditable={<ContentEditable />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={null}
          />
          <HistoryPlugin externalHistoryState={historyState} />
        </>
      )}
      {(isCharLimit || isCharLimitUtf8) && hasMaxLength && (
        <CharacterLimitPlugin charset={isCharLimit ? 'UTF-16' : 'UTF-8'} maxLength={maxLength} />
      )}
      {isAutocomplete && <AutocompletePlugin />}
      <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
      {enabledActionFeature && <ActionsPlugin />}
      {showTreeView && <TreeViewPlugin />}
    </div>
  );
}
