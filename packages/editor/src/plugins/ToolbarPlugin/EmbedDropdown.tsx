import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin';
import clsx from 'clsx';
import { LexicalEditor } from 'lexical';
import * as React from 'react';

import { Dropdown } from '~/components';
import { useI18n } from '~/context/i18n';
import { useSettings } from '~/context/settings';
import { EmbedConfigs } from '~/plugins/AutoEmbedPlugin';

export interface EmbedDropdownProps {
  disabled?: boolean;
  editor: LexicalEditor;
}

export function EmbedDropdown({ disabled, editor }: EmbedDropdownProps) {
  const { t } = useI18n();
  const { settings } = useSettings();
  const { enabledEmbedFeature, enabledFigmaDocumentFeature, enabledTweeterFeature, enabledYoutubeFeature } = settings;

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  if (!enabledEmbedFeature) {
    return null;
  }

  return (
    <Dropdown root={buttonRef.current} strategy="absolute">
      <Dropdown.Trigger
        aria-label={t('toolbar.embed') as string}
        buttonIconClassName="icon plus"
        className={clsx('toolbar-item')}
        disabled={disabled}
        ref={buttonRef}
      >
        {t('toolbar.embed')}
      </Dropdown.Trigger>
      <Dropdown.Panel>
        {EmbedConfigs.map((embedConfig) => {
          switch (embedConfig.type) {
            case 'figma': {
              if (!enabledFigmaDocumentFeature) {
                return null;
              }
              break;
            }
            case 'tweet': {
              if (!enabledTweeterFeature) {
                return null;
              }
              break;
            }
            case 'youtube-video': {
              if (!enabledYoutubeFeature) {
                return null;
              }
              break;
            }
          }
          return (
            <Dropdown.Item
              onClick={() => {
                editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
              }}
              className="item"
              key={embedConfig.type}
            >
              {embedConfig.icon}
              <span className="text">{embedConfig.contentName}</span>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Panel>
    </Dropdown>
  );
}
