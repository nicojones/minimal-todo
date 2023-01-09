import React, { ReactChild, ReactNode, useState } from "react";
import TwitterPicker from "react-color/lib/components/twitter/Twitter";

import { ColorIconChoice, IProject } from "interfaces";
import { IconPicker } from "components/IconPicker/IconPicker";

import "./color-and-icon-picker.scss";

interface ColorAndIconPickerAttrs {
  onChangeComplete: (
    colorAndIcon: ColorIconChoice
  ) => any;
  color: string;
  icon: string;
  canEdit: boolean;
}
export const ColorAndIconPicker = ({
  onChangeComplete,
  color,
  icon,
  canEdit
}: ColorAndIconPickerAttrs) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  function setColorAndIcon(
    colorAndIconChoice: ColorIconChoice
  ) {
    setShowColorPicker(false);
    onChangeComplete(colorAndIconChoice);
  }

  return (
    <span className="relative">
      <button
        className="ib h-100 color-picker-icon"
        onClick={() => canEdit ? setShowColorPicker(true) : null}
      >
        <i className="material-icons tiny left m0" style={{ color: color }}>
          {icon}
        </i>
      </button>
      {(showColorPicker) ? (
        <>
          <div className="color-picker">
            <TwitterPicker
              color={color}
              onChangeComplete={(color: { hex: string }) =>
                setColorAndIcon({ color: color.hex })
              }
            ></TwitterPicker>
            <div className="icon-picker">
              <IconPicker
                icon={icon}
                onIconChange={(e: IProject["icon"]) =>
                  setColorAndIcon({ icon: e })
                }
              />
            </div>
          </div>
          <div className="backdrop" onClick={() => setShowColorPicker(false)} />
        </>
      ) : (
        ""
      )}
    </span>
  );
}
