import React, { useState } from "react";
import TwitterPicker from "react-color/lib/components/twitter/Twitter";

interface ColorPickerAttrs {
  onChangeComplete: (hexColor: string) => any;
  color: string;
  icon: string;
  title: string;
}
export function ColorPicker({
  onChangeComplete,
  color,
  icon,
  title
}: ColorPickerAttrs) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  function setColor(colorChoice: { hex: string }) {
    setShowColorPicker(false);
    onChangeComplete(colorChoice.hex);
  }

  return (
    <span className="relative">
      <button className="ib h-100"
       onClick={() => setShowColorPicker(true)}
       title={title}
       >
        <i className="material-icons tiny left m0" style={{ color: color }}>
          {icon}
        </i>
      </button>
      {showColorPicker ? (
        <>
          <div className="color-picker">
            <TwitterPicker color={color} onChangeComplete={setColor} />
          </div>
          <div className="backdrop" onClick={() => setShowColorPicker(false)} />
        </>
      ) : (
        ""
      )}
    </span>
  );
}
