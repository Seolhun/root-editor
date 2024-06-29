import * as React from 'react';

import { MentionOption } from './MentionPlugin.types';

export interface MentionTypeaheadMenuItemProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionOption;
}

export function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: MentionTypeaheadMenuItemProps) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      aria-selected={isSelected}
      className={className}
      id={`typeahead-item-${index}`}
      key={option.key}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={option.setRefElement}
      role="option"
      tabIndex={-1}
    >
      {option.picture}
      <span className="text">{option.name}</span>
    </li>
  );
}
