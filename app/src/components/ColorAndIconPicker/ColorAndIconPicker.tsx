import React, { ReactChild, ReactNode, useState } from "react";
import TwitterPicker from "react-color/lib/components/twitter/Twitter";

import { ColorIconChoice, IProject } from "interfaces";
import { IconPicker } from "components/IconPicker/IconPicker";

import "./color-and-icon-picker.scss";

interface ColorAndIconPickerAttrs {
  onChangeComplete: (colorAndIcon: ColorIconChoice) => any;
  color: string;
  icon: string;
  canEdit: boolean;

  hideIconPicker?: boolean | true;
  hideColorPicker?: boolean | true;
}

export const ColorAndIconPicker = ({
  onChangeComplete,
  color,
  icon,
  hideIconPicker,
  hideColorPicker,
  canEdit,
}: ColorAndIconPickerAttrs) => {
  const [showPicker, setShowColorPicker] = useState(false);

  function setColorAndIcon(colorAndIconChoice: ColorIconChoice) {
    setShowColorPicker(false);
    onChangeComplete(colorAndIconChoice);
  }

  return (
    <span className="relative icon">
      <button
        className="ib h-100 color-picker-icon"
        onClick={() => (canEdit ? setShowColorPicker(true) : null)}
      >
        <i className="material-icons tiny left m0" style={{ color: color }}>
          {icon}
        </i>
      </button>
      {showPicker ? (
        <>
          <div className="color-picker">
            {hideColorPicker ? null : (
              <TwitterPicker
                color={color}
                onChangeComplete={(color: { hex: string }) =>
                  setColorAndIcon({ color: color.hex })
                }
              ></TwitterPicker>
            )}
            {hideIconPicker ? null : (
              <div className="icon-picker">
                <IconPicker
                  icon={icon}
                  onIconChange={(e: IProject["icon"]) =>
                    setColorAndIcon({ icon: e })
                  }
                />
              </div>
            )}
          </div>
          <div className="backdrop" onClick={() => setShowColorPicker(false)} />
        </>
      ) : (
        ""
      )}
    </span>
  );
};
