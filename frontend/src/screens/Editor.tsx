import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { HomeStackParamList } from "./Routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<HomeStackParamList, "Editor">;

// TODO: implement
const Editor = (props: Props) => {
  const navigation = props.navigation;
  const id = props.route.params.noteId;
  const isNewNote = id === undefined;

  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full">
      <Text className="text-xl font-bold text-blue-500">Editor</Text>
      {isNewNote && <Text>Creating a new note</Text>}
      {!isNewNote && <Text>Editing a note with id: {id}</Text>}
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text className="text-m underline text-blue-900">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Editor;
