import React from "react";
import * as Icons from "react-icons/fa";

type FaDynamicIconsProps = {
  name: string;
  color?: string;
  style?: any;
};

const index = ({ name, color, style }: FaDynamicIconsProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.FaDesktop color={color} style={style} />;
  }

  return <IconComponent color={color} style={style} />;
};

export default index;
