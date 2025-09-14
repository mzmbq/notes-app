import { Pressable, Text, View } from "react-native";
import React from "react";
import { Tag } from "notes-app-types";
import { log } from "../logger/logger";
import {
  IconSquareRounded,
  IconSquareRoundedX,
} from "@tabler/icons-react-native";

type Props = {
  tag: Tag;
  isActive: boolean;
  isDeletingModActive?: boolean;
  deleteTag?: () => void;
};

const TagPill = (props: Props) => {
  return (
    <View
      className="flex flex-row justinfy-center items-center rounded-xl px-2 py-1"
      // Tailwind does not support dynamic colors, so we use inline styles
      style={{
        backgroundColor: props.isActive ? props.tag.backgroundColor : "#B5B5B5",
      }}
    >
      <Text style={{ color: props.isActive ? props.tag.textColor : "#2E2E2E" }}>
        {props.tag.title}
      </Text>
      {props.isDeletingModActive && (
        <Pressable className="ml-1" onPress={props.deleteTag}>
          <IconSquareRoundedX />
        </Pressable>
      )}
    </View>
  );
};

export default TagPill;
