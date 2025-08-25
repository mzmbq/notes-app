import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { HomeStackParamList } from "./Routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchCreateNote, fetchUpdateNote } from "../api/note";
import { useAuth } from "../hooks/useAuth";
import { log } from "../logger/logger";

type Props = NativeStackScreenProps<HomeStackParamList, "Editor">;

// TODO: implement
const Editor = (props: Props) => {
  const navigation = props.navigation;
  const note = props.route.params.note;
  const auth = useAuth();
  const [title, setTitle] = useState<string>(note?.title ?? "");
  const [content, setContent] = useState<string>(note?.content ?? "");
  const [editorMode, setEditorMode] = useState<"Create" | "Update" | undefined>(
    undefined
  );

  useEffect(() => {
    if (note) {
      setEditorMode("Update");
    } else {
      setEditorMode("Create");
    }
  }, []);

  const createNote = (title: string, content: string) => {
    if (!auth.state.authenticated || !auth.state.token) {
      log.error("[Home] Not authorized. Cannot load notes.");
      return;
    }
    fetchCreateNote({
      token: auth.state.token,
      title: title,
      content: content,
    });
  };

  const updateNote = (title?: string, content?: string) => {
    if (note)
      fetchUpdateNote({
        id: note?.id,
        title: title,
        content: content,
      });
  };

  const SubmitButton = () => {
    return (
      <>
        {editorMode === "Create" && (
          <TouchableOpacity
            onPress={() => {
              createNote(title, content);
              navigation.navigate("Home");
            }}
          >
            <Text className="text-m underline text-blue-900">Save</Text>
          </TouchableOpacity>
        )}
        {editorMode === "Update" && (
          <TouchableOpacity
            onPress={() => {
              updateNote(title, content);
              navigation.navigate("Home");
            }}
          >
            <Text className="text-m underline text-blue-900">Update</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full">
      <Text className="text-xl font-bold text-blue-500">Editor</Text>
      {editorMode === "Create" && <Text>Creating a new note</Text>}
      {editorMode === "Update" && (
        <Text>Editing a note with id: {note?.id}</Text>
      )}
      <View className="w-[50%]">
        <TextInput
          className="border border-gray-300 rounded-lg p-2"
          value={title}
          onChangeText={setTitle}
        ></TextInput>
        <TextInput
          className="border border-gray-300 rounded-lg p-2"
          value={content}
          onChangeText={setContent}
        ></TextInput>
      </View>

      <View>
        <SubmitButton />
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text className="text-m underline text-blue-900">Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Editor;
