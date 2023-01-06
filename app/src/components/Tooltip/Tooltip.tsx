import {Tooltip as ReactTooltip} from "react-tooltip";

import "/node_modules/react-tooltip/dist/react-tooltip.css";

interface ITooltipProps {
  anchorId: string;
  html?: string;
}

export const Tooltip = ({ anchorId, html }: ITooltipProps) =>
  (window as any).isSmallScreen ? null : (
    <ReactTooltip
      anchorId={anchorId}
      place={'bottom'}
      delayShow={1000}
      positionStrategy={'absolute'}
      delayHide={100}
      noArrow={false}
      style={ { transform: "scale(0.8)"}}
      html={html}
    />
  );
