import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import React from "react";
import { Tag } from "notes-app-types";
import TagPill from "./Tag";

type Props = {
  title: string;
  content: string;
  onPress?: (event: GestureResponderEvent) => void;
  tags: Tag[];
};

// TODO: implement
const NoteCard = (props: Props) => {
  const tags: Tag[] = [
    {
      color: "#ff00ff",
      id: "1231",
      title: "tag1",
    },
    {
      color: "#00ffff",
      id: "123",
      title: "tag2",
    },
    {
      color: "#00ff00",
      id: "1232",
      title: "tag3",
    },
  ];

  return (
    <TouchableOpacity className="w-full" onPress={props.onPress}>
      <View className="bg-slate-300 border-solid border-black rounded-xl w-full p-2">
        <Text className="text-xl font-bold flex flex-row">{props.title}</Text>
        <View className="flex flex-row gap-1">
          {tags.map((t) => (
            <TagPill tag={t} key={t.id} />
          ))}
        </View>
        <Text>{props.content}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NoteCard;
