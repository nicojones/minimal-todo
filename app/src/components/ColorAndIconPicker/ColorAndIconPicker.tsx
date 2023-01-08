import React, { ReactChild, ReactNode, useState } from "react";
import TwitterPicker from "react-color/lib/components/twitter/Twitter";

import { IProject } from "interfaces";
import { IconPicker } from "components/IconPicker/IconPicker";

import "./color-and-icon-picker.scss";

interface ColorAndIconPickerAttrs {
  onChangeComplete: (
    colorAndIcon: Partial<Pick<IProject, "color" | "icon">>
  ) => any;
  color: string;
  icon: string;
}
export const ColorAndIconPicker = ({
  onChangeComplete,
  color,
  icon,
}: ColorAndIconPickerAttrs) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  function setColorAndIcon(
    colorChoice: Partial<Pick<IProject, "color" | "icon">>
  ) {
    setShowColorPicker(false);
    onChangeComplete(colorChoice);
  }

  return (
    <span className="relative">
      <button
        className="ib h-100"
        onClick={() => setShowColorPicker(true)}
      >
        <i className="material-icons tiny left m0" style={{ color: color }}>
          {icon}
        </i>
      </button>
      {showColorPicker ? (
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
