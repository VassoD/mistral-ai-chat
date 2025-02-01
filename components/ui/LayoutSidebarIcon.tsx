import React from "react";
import Svg, { Path } from "react-native-svg";

interface LayoutSidebarIconProps {
  size?: number;
  color?: string;
}

export function LayoutSidebarIcon({
  size = 24,
  color = "#FFFFFF",
}: LayoutSidebarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z"
        fill={color}
      />
    </Svg>
  );
}
