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
    <Text className={`rounded-xl bg-[${props.tag.color}] px-2 py-0.5`}>
      {props.tag.title}
    </Text>
  );
};

export default TagPill;
