import React from "react";
import ReactTooltip from "react-tooltip";

export const Tooltip = () =>
  (window as any).isSmallScreen ? null : (
    <ReactTooltip
      place="bottom"
      type="dark"
      effect="solid"
      delayShow={1000}
      html={true}
    />
  );
