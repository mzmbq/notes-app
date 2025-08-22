import { Text } from "react-native";
import React from "react";
import { Tag } from "notes-app-types";
import { log } from "../logger/logger";

type Props = {
  tag: Tag;
};

// TODO: implement
const TagPill = (props: Props) => {
  log.info("Tag", props.tag.color);
  return (
    <Text
      className="rounded-xl px-2 py-0.5"
      // Tailwind does not support dynamic colors, so we use inline styles
      style={{ backgroundColor: props.tag.color }}
    >
      {props.tag.title}
    </Text>
  );
};

export default TagPill;
