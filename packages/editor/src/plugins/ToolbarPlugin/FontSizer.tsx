import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { $patchStyleText } from '@lexical/selection';
import clsx from 'clsx';
import { $getSelection, LexicalEditor } from 'lexical';
import * as React from 'react';

import './FontSizer.scss';

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 15;

// eslint-disable-next-line no-shadow
enum updateFontSizeType {
  decrement = -1,
  increment = 1,
}

export interface FontSizerProps {
  disabled: boolean;
  editor: LexicalEditor;
  selectionFontSize: string;
}

export function FontSizer({ disabled, editor, selectionFontSize }: FontSizerProps) {
  const [inputValue, setInputValue] = React.useState<string>(selectionFontSize);
  const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false);

  /**
   * Calculates the new font size based on the update type.
   * @param currentFontSize - The current font size
   * @param updateType - The type of change, either increment or decrement
   * @returns the next font size
   */
  const calculateNextFontSize = (currentFontSize: number, updateType: null | updateFontSizeType) => {
    if (!updateType) {
      return currentFontSize;
    }

    let updatedFontSize: number = currentFontSize;
    switch (updateType) {
      case updateFontSizeType.decrement:
        switch (true) {
          case currentFontSize > MAX_ALLOWED_FONT_SIZE:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize >= 48:
            updatedFontSize -= 12;
            break;
          case currentFontSize >= 24:
            updatedFontSize -= 4;
            break;
          case currentFontSize >= 14:
            updatedFontSize -= 2;
            break;
          case currentFontSize >= 9:
            updatedFontSize -= 1;
            break;
          default:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
        }
        break;

      case updateFontSizeType.increment:
        switch (true) {
          case currentFontSize < MIN_ALLOWED_FONT_SIZE:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize < 12:
            updatedFontSize += 1;
            break;
          case currentFontSize < 20:
            updatedFontSize += 2;
            break;
          case currentFontSize < 36:
            updatedFontSize += 4;
            break;
          case currentFontSize <= 60:
            updatedFontSize += 12;
            break;
          default:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
        }
        break;

      default:
        break;
    }
    return updatedFontSize;
  };
  /**
   * Patches the selection with the updated font size.
   */

  const updateFontSizeInSelection = React.useCallback(
    (newFontSize: null | string, updateType: null | updateFontSizeType) => {
      const getNextFontSize = (prevFontSize: null | string): string => {
        if (!prevFontSize) {
          prevFontSize = `${DEFAULT_FONT_SIZE}px`;
        }
        prevFontSize = prevFontSize.slice(0, -2);
        const nextFontSize = calculateNextFontSize(Number(prevFontSize), updateType);
        return `${nextFontSize}px`;
      };

      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, {
              'font-size': newFontSize || getNextFontSize,
            });
          }
        }
      });
    },
    [editor],
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(inputValue);

    if (['-', '+', 'e', 'E'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault();
      setInputValue('');
      return;
    }
    setInputChangeFlag(true);
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();

      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleInputBlur = () => {
    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleButtonClick = (updateType: updateFontSizeType) => {
    if (inputValue !== '') {
      const nextFontSize = calculateNextFontSize(Number(inputValue), updateType);
      updateFontSizeInSelection(String(nextFontSize) + 'px', null);
    } else {
      updateFontSizeInSelection(null, updateType);
    }
  };

  const updateFontSizeByInputValue = (inputValueNumber: number) => {
    let updatedFontSize = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE;
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE;
    }

    setInputValue(String(updatedFontSize));
    updateFontSizeInSelection(String(updatedFontSize) + 'px', null);
    setInputChangeFlag(false);
  };

  React.useEffect(() => {
    setInputValue(selectionFontSize);
  }, [selectionFontSize]);

  return (
    <div className={clsx('RootEditor__FontSizer')}>
      <button
        className={clsx('toolbar-item font-decrement')}
        disabled={disabled || (selectionFontSize !== '' && Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)}
        onClick={() => handleButtonClick(updateFontSizeType.decrement)}
        type="button"
      >
        <MinusIcon className={clsx('size-8', 'rounded-md')} />
      </button>

      <input
        className={clsx('toolbar-item font-size-input')}
        disabled={disabled}
        max={MAX_ALLOWED_FONT_SIZE}
        min={MIN_ALLOWED_FONT_SIZE}
        onBlur={handleInputBlur}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        type="number"
        value={inputValue}
      />

      <button
        className={clsx('toolbar-item font-increment')}
        disabled={disabled || (selectionFontSize !== '' && Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)}
        onClick={() => handleButtonClick(updateFontSizeType.increment)}
        type="button"
      >
        <PlusIcon className={clsx('size-8', 'rounded-md')} />
      </button>
    </div>
  );
}
