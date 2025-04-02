import React, { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface Props {
  value?: string;
  onPickerChange: (value: string) => void;
}
const ColorPicker = ({ value, onPickerChange }: Props) => {
  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <p>#</p>
        <HexColorInput
          color={value}
          onChange={onPickerChange}
          className="hex-input"
        />
        <HexColorPicker color={value} onChange={onPickerChange} />
      </div>
    </div>
  );
};
export default ColorPicker;
