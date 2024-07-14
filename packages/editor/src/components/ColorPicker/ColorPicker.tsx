import { calculateZoomLevel } from '@lexical/utils';
import { useMergeRefs } from '@seolhun/root-ui';
import clsx from 'clsx';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import TextInput from '~/ui/TextInput';

import { BASIC_COLORS } from './ColorPicker.const';
import { clamp, transformColor } from './ColorPicker.utils';

import './ColorPicker.scss';

let skipAddingToHistoryStack = false;

interface ColorPickerProps {
  color: string;
  onChange?: (value: string, skipHistoryStack: boolean) => void;
}

const WIDTH = 214;
const HEIGHT = 150;

export function ColorPicker({ color, onChange }: Readonly<ColorPickerProps>): JSX.Element {
  const wrapperRef = useRef(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [selfColor, setSelfColor] = useState(() => transformColor('hex', color));
  const [inputColor, setInputColor] = useState(color);

  const saturationPosition = useMemo(() => {
    const width = saturationRef.current?.clientWidth ?? WIDTH;
    const height = saturationRef.current?.clientHeight ?? HEIGHT;
    return {
      x: (selfColor.hsv.s / 100) * width,
      y: ((100 - selfColor.hsv.v) / 100) * height,
    };
  }, [selfColor.hsv.s, selfColor.hsv.v]);

  const huePosition = useMemo(() => {
    const width = hueRef.current?.clientWidth ?? WIDTH;
    return {
      x: (selfColor.hsv.h / 360) * width,
    };
  }, [selfColor.hsv]);

  const onSetHex = (hex: string) => {
    setInputColor(hex);
    const isHex = /^#[0-9A-Fa-f]{6}$/i.test(hex);
    if (isHex) {
      const newColor = transformColor('hex', hex);
      setSelfColor(newColor);
    }
  };

  const onMoveSaturation = ({ x, y }: Position) => {
    const newHsv = {
      ...selfColor.hsv,
      s: (x / WIDTH) * 100,
      v: 100 - (y / HEIGHT) * 100,
    };
    const newColor = transformColor('hsv', newHsv);
    setSelfColor(newColor);
    setInputColor(newColor.hex);
  };

  const onMoveHue = ({ x }: Position) => {
    const newHsv = { ...selfColor.hsv, h: (x / WIDTH) * 360 };
    const newColor = transformColor('hsv', newHsv);

    setSelfColor(newColor);
    setInputColor(newColor.hex);
  };

  useEffect(() => {
    if (wrapperRef.current !== null && onChange) {
      onChange(selfColor.hex, skipAddingToHistoryStack);
      setInputColor(selfColor.hex);
    }
  }, [selfColor, onChange]);

  useEffect(() => {
    if (color === undefined) {
      return;
    }
    const newColor = transformColor('hex', color);
    setSelfColor(newColor);
    setInputColor(newColor.hex);
  }, [color]);

  return (
    <div className={clsx('py-4 px-6', 'rounded-lg', 'shadow')} ref={wrapperRef} style={{ width: WIDTH }}>
      <TextInput label="Hex" onChange={onSetHex} value={inputColor} />
      <div className="color-picker-basic-color">
        {BASIC_COLORS.map((basicColor) => {
          const active = basicColor === selfColor.hex;
          return (
            <button
              className={clsx(
                {
                  active,
                },
                'border border-neutral-2 dark:border-neutral-7',
              )}
              onClick={() => {
                setInputColor(basicColor);
                setSelfColor(transformColor('hex', basicColor));
              }}
              key={basicColor}
              style={{ backgroundColor: basicColor }}
              type="button"
            />
          );
        })}
      </div>
      <MoveWrapper
        style={{
          backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)`,
        }}
        className="color-picker-saturation"
        onChange={onMoveSaturation}
        ref={saturationRef}
      >
        <div
          style={{
            backgroundColor: selfColor.hex,
            left: saturationPosition.x,
            top: saturationPosition.y,
          }}
          className="color-picker-saturation_cursor"
        />
      </MoveWrapper>
      <MoveWrapper className="color-picker-hue" onChange={onMoveHue} ref={hueRef}>
        <div
          style={{
            backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)`,
            left: huePosition.x,
          }}
          className="color-picker-hue_cursor"
        />
      </MoveWrapper>
      <div className="color-picker-color" style={{ backgroundColor: selfColor.hex }} />
    </div>
  );
}

export interface Position {
  x: number;
  y: number;
}

interface MoveWrapperProps {
  children: JSX.Element;
  className?: string;
  onChange: (position: Position) => void;
  style?: React.CSSProperties;
}

const MoveWrapper = React.forwardRef<HTMLDivElement, MoveWrapperProps>(
  ({ className, children, onChange, style }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs([ref, divRef]);
    const draggedRef = useRef(false);

    const move = (e: MouseEvent | React.MouseEvent): void => {
      if (divRef.current) {
        const { current: div } = divRef;
        const { height, left, top, width } = div.getBoundingClientRect();
        const zoom = calculateZoomLevel(div);
        const x = clamp(e.clientX / zoom - left, width, 0);
        const y = clamp(e.clientY / zoom - top, height, 0);

        onChange({ x, y });
      }
    };

    const onMouseDown = (e: React.MouseEvent): void => {
      if (e.button !== 0) {
        return;
      }
      move(e);

      const onMouseMove = (_e: MouseEvent): void => {
        draggedRef.current = true;
        skipAddingToHistoryStack = true;
        move(_e);
      };

      const onMouseUp = (_e: MouseEvent): void => {
        if (draggedRef.current) {
          skipAddingToHistoryStack = false;
        }
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        move(_e);
        draggedRef.current = false;
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    };

    return (
      <div className={className} onMouseDown={onMouseDown} ref={mergedRef} style={style}>
        {children}
      </div>
    );
  },
);
