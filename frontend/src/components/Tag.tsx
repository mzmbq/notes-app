import { Text } from "react-native";
import React from "react";
import { Tag } from "notes-app-types";
import { log } from "../logger/logger";

type Props = {
  tag: Tag;
  isActive: boolean;
};

// TODO: implement
const TagPill = (props: Props) => {
  return (
    <Text
      className="rounded-xl px-2 py-0.5"
      // Tailwind does not support dynamic colors, so we use inline styles
      style={{
        backgroundColor: props.isActive ? props.tag.backgroundColor : "#B5B5B5",
        color: props.isActive ? props.tag.textColor : "#2E2E2E",
      }}
    >
      {props.tag.title}
    </Text>
  );
};

export default TagPill;
