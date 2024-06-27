import { $patchStyleText } from '@lexical/selection';
import clsx from 'clsx';
import { $getSelection, LexicalEditor } from 'lexical';
import * as React from 'react';

import { Dropdown } from '~/components';

export interface FontDropdownProps {
  disabled?: boolean;
  editor: LexicalEditor;
  style: string;
  value: string;
}

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
];

function dropDownActiveClass(active: boolean) {
  return clsx({
    'active dropdown-item-active': active,
  });
}

export function FontDropdown({ disabled = false, editor, style, value }: FontDropdownProps): JSX.Element {
  const handleClick = React.useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === 'font-family' ? 'Formatting options for font family' : 'Formatting options for font size';

  return (
    <Dropdown
      buttonAriaLabel={buttonAriaLabel}
      buttonClassName={'toolbar-item ' + style}
      buttonIconClassName={style === 'font-family' ? 'icon block-type font-family' : ''}
      buttonLabel={value}
      disabled={disabled}
    >
      <Dropdown.ItemList>
        {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(([option, text]) => (
          <Dropdown.Item
            className={clsx('item', dropDownActiveClass(value === option), {
              'fontsize-item': style === 'font-size',
            })}
            key={option}
            onClick={() => handleClick(option)}
          >
            <span className="text">{text}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.ItemList>
    </Dropdown>
  );
}
