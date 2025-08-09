import React from "react";

export const createTabIcon = (
  icon: React.ComponentType<{ color: string; size: number }>,
  iconFilled?: React.ComponentType<{ color: string; size: number }>
) => {
  const iconF = iconFilled ?? icon;

  return (props: { focused: boolean; color: string; size: number }) => {
    const IconComponent = props.focused ? iconF : icon;
    return <IconComponent color={props.color} size={props.size} />;
  };
};
