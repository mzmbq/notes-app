import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HomeStackParamList } from "./Routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchCreateNote, fetchUpdateNote } from "../api/note";
import { fetchAllTags } from "../api/tag";
import { useAuth } from "../hooks/useAuth";
import { log } from "../logger/logger";
import { debounce } from "lodash";
import { Tag } from "notes-app-types";
import TagPill from "../components/Tag";

type Props = NativeStackScreenProps<HomeStackParamList, "Editor">;

// TODO: implement
const Editor = (props: Props) => {
  const navigation = props.navigation;
  const note = props.route.params.note;
  const auth = useAuth();
  const [title, setTitle] = useState<string>(note?.title ?? "");
  const [content, setContent] = useState<string>(note?.content ?? "");
  const [noteId, setNoteId] = useState<string | undefined>(note?.id);
  const [isSaved, setIsSaved] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);

  const doCreate = async (title: string, content: string) => {
    try {
      if (!auth.state.authenticated || !auth.state.token) {
        log.error("[Home] Not authorized. Cannot load notes.");
        return;
      }
      const created = await fetchCreateNote({
        token: auth.state.token,
        title: title,
        content: content,
      });
      setNoteId(created.id);
      return created;
    } catch (err) {
      log.error(err);
    }
  };

  const doUpdate = async (title: string, content: string) => {
    if (!noteId) return;
    try {
      return await fetchUpdateNote({
        id: noteId,
        title: title,
        content: content,
      });
    } catch (err) {
      log.err(err);
    }
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    setIsSaved(false);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
    setIsSaved(false);
  };

  const saveNote = async () => {
    const t = title.trim();
    const c = content.trim();

    if (!t && !c) {
      return;
    }
    if (!noteId) {
      const note = await doCreate(t, c);
      if (note) {
        props.route.params?.updateNote(note);
      }
    } else {
      const note = await doUpdate(t, c);
      if (note) {
        props.route.params?.updateNote(note);
      }
    }
    setTimeout(() => {
      console.log("Saved: ", title, content);

      setIsSaved(true);
    }, 100);
  };

  const debouncedSaveNote = debounce(saveNote, 200);

  useEffect(() => {
    if (!isSaved) {
      debouncedSaveNote();
      return () => {
        debouncedSaveNote.cancel();
      };
    }
  }, [title, content]);

  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      if (isSaved) return;
      e.preventDefault();
      saveNote();
      debouncedSaveNote.cancel();
    });
    return unsub;
  }, [navigation, isSaved]);

  useEffect(() => {
    fetchTags();
    console.log("tags", tags);
  }, []);

  const fetchTags = async () => {
    try {
      if (!auth.state.authenticated || !auth.state.token) {
        log.error("[Home] Not authorized. Cannot load notes.");
        return;
      }
      const tags = await fetchAllTags();
      setTags(tags);
    } catch (err) {
      log.error(err);
    }
  };

  return (
    <View className="flex flex-col w-full h-full bg-white">
      <View className="flex flex-row items-center justify-between gap-10">
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ gap: 6 }}
          showsHorizontalScrollIndicator={false}
          className="flex flex-row my-4 overflow-auto"
        >
          {tags.map((tag) => (
            <View key={tag.id}>
              <TagPill tag={tag}></TagPill>
            </View>
          ))}
        </ScrollView>
        <Pressable>
          <Text>Tag + </Text>
        </Pressable>
      </View>
      <View>
        <TextInput
          multiline={true}
          onChangeText={handleTitleChange}
          value={title}
          placeholder={title ? "" : "Title..."}
          className=" text-3xl"
        />
        <TextInput
          multiline={true}
          value={content}
          onChangeText={handleContentChange}
          className=" text-lg"
        />
      </View>
    </View>
  );
};

export default Editor;
