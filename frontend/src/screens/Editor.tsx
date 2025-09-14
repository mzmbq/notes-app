import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HomeStackParamList } from "./Routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchCreateNote, fetchUpdateNote } from "../api/note";
import {
  fetchAddTagToNote,
  fetchAllTags,
  fetchCreateTag,
  fetchRemoveTagFromNote,
  fetchTagsByNote,
} from "../api/tag";
import { useAuth } from "../hooks/useAuth";
import { log } from "../logger/logger";
import { debounce } from "lodash";
import { Tag } from "notes-app-types";
import TagPill from "../components/Tag";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = NativeStackScreenProps<HomeStackParamList, "Editor">;
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Editor = (props: Props) => {
  const navigation = props.navigation;
  const note = props.route.params.note;
  const auth = useAuth();
  const [title, setTitle] = useState<string>(note?.title ?? "");
  const [content, setContent] = useState<string>(note?.content ?? "");
  const [noteId, setNoteId] = useState<string | undefined>(note?.id);
  const [isSaved, setIsSaved] = useState(true);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [activeTags, setActiveTags] = useState<Tag[]>([]);
  const [newTagTitle, setNewTagTitle] = useState<string>("");

  const [isTagsModalVisible, setIsTagsModalVisible] = useState<boolean>(false);
  const [isCreateNewTagInputsVisible, setIsCreatingNewTagInputsVisible] =
    useState<boolean>(false);

  // Shared values for blur intensity and dark overlay opacity
  const blur = useSharedValue(0);
  const dimOpacity = useSharedValue(0);
  // Animate when modalVisible changes
  useEffect(() => {
    if (isTagsModalVisible) {
      blur.value = withTiming(30, { duration: 100 }); // Ziel-Blur
      dimOpacity.value = withTiming(0.2, { duration: 100 }); // Ziel-Opacity
    } else {
      blur.value = withTiming(0, { duration: 100 });
      dimOpacity.value = withTiming(0, { duration: 100 });
    }
  }, [isTagsModalVisible]);

  // Animated props for BlurView: intensity ist animierbar über Animated.createAnimatedComponent
  const blurProps = useAnimatedProps(() => ({ intensity: blur.value }));

  // Animated style für dunklen Overlay
  const dimStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0,0,0,${dimOpacity.value})`,
  }));

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
  }, []);

  const fetchTags = async () => {
    try {
      if (!auth.state.authenticated || !auth.state.token) {
        log.error("[Home] Not authorized. Cannot load tags.");
        return;
      }
      const tags = await fetchAllTags();
      setAllTags(tags);
    } catch (err) {
      log.error(err);
    }
  };

  const closeModal = () => {
    setIsCreatingNewTagInputsVisible(false);
    setIsTagsModalVisible(false);
  };

  const createTag = async () => {
    try {
      if (!auth.state.authenticated || !auth.state.token) {
        log.error("[Home] Not authorized. Cannot create tag.");
        return;
      }
      await fetchCreateTag(newTagTitle, "#000", "#E6DAF0");
      fetchTags();
    } catch (err) {
      log.error(err);
    }
  };

  useEffect(() => {
    if (noteId) getTagsByNote();
  }, [noteId]);

  const getTagsByNote = async () => {
    if (!noteId) return;
    try {
      const tags = await fetchTagsByNote(noteId);
      setActiveTags(tags);
    } catch (err) {
      log.error(err);
    }
  };

  const isTagActive = (tag: Tag): boolean => {
    if (activeTags.find((t) => t.id === tag.id)) {
      return true;
    } else {
      return false;
    }
  };

  const addTagToNote = async (tag: Tag) => {
    if (!noteId || !note) return;
    try {
      if (!auth.state.authenticated || !auth.state.token) {
        log.error("[Home] Not authorized. Cannot add tag to note.");
        return;
      }
      await fetchAddTagToNote(noteId, tag.id);
      setActiveTags((prev) =>
        prev.some((t) => t.id === tag.id) ? prev : [...prev, tag]
      );
      /** Trigger rerender of tags on the Home Screen */
      const tags = await fetchTagsByNote(noteId);
      props.route.params?.updateNote?.({ ...note, tags: tags });
    } catch (err) {
      log.error(err);
    }
  };

  const removeTagFromNote = async (tag: Tag) => {
    if (!noteId || !note) return;
    try {
      if (!auth.state.authenticated || !auth.state.token) {
        log.error("[Home] Not authorized. Cannot add tag to note.");
        return;
      }
      await fetchRemoveTagFromNote(noteId, tag.id);
      setActiveTags((prev) => prev.filter((t) => t.id !== tag.id));
      /** Trigger rerender of tags on the Home Screen */
      const tags = await fetchTagsByNote(noteId);
      props.route.params?.updateNote?.({ ...note, tags: tags });
    } catch (err) {
      log.error(err);
    }
  };

  return (
    <>
      <View className="flex flex-col w-full h-full bg-white">
        <View className="flex flex-row items-center justify-between gap-10">
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ gap: 6 }}
            showsHorizontalScrollIndicator={false}
            className="flex flex-row my-4 overflow-auto"
          >
            {activeTags.map((tag) => (
              <View key={tag.id}>
                <TagPill tag={tag} isActive={true}></TagPill>
              </View>
            ))}
          </ScrollView>
          <Pressable
            className="mr-2 p-2 bg-slate-500"
            onPress={() => setIsTagsModalVisible(true)}
          >
            <Text>Tags</Text>
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
      <Modal
        animationType="none"
        transparent={true}
        visible={isTagsModalVisible}
        onRequestClose={() => closeModal()}
      >
        <View className="flex-1 items-center bg-red-300/50 backdrop-blur-sm">
          <AnimatedBlurView
            animatedProps={blurProps}
            className="absolute inset-0"
            tint="systemThinMaterial"
          />
          <Animated.View style={[StyleSheet.absoluteFill, dimStyle]} />
          <View className="bg-slate-600 mt-20 border rounded-2xl p-5 w-[90%]">
            <Text className="text-white mb-4">Tags</Text>
            <View>
              <View className="flex flex-row gap-x-3 gap-y-2 flex-wrap">
                {allTags.map((tag) => (
                  <View key={tag.id}>
                    <Pressable
                      onPress={() => {
                        if (isTagActive(tag)) {
                          removeTagFromNote(tag);
                        } else {
                          addTagToNote(tag);
                        }
                      }}
                    >
                      <TagPill tag={tag} isActive={isTagActive(tag)}></TagPill>
                    </Pressable>
                  </View>
                ))}
              </View>
              <View className="my-4">
                <Pressable
                  onPress={() =>
                    setIsCreatingNewTagInputsVisible(
                      !isCreateNewTagInputsVisible
                    )
                  }
                >
                  <Text>Create new Tag</Text>
                </Pressable>
                {isCreateNewTagInputsVisible && (
                  <View className="relative">
                    <TextInput
                      className="border rounded-lg p-2"
                      placeholder="Enter a name for a tag"
                      onChangeText={setNewTagTitle}
                      value={newTagTitle}
                    />
                    <Pressable
                      className="absolute right-0 top-0 bottom-0 bg-white rounded-lg justify-center items-center p-2"
                      onPress={() => {
                        createTag();
                        setNewTagTitle("");
                      }}
                    >
                      <Text>Create</Text>
                    </Pressable>
                  </View>
                )}
              </View>
              <View className="flex flex-row justify-between">
                <Pressable
                  onPress={() => {
                    closeModal();
                  }}
                >
                  <Text className="text-white">Delete</Text>
                </Pressable>
                <Pressable onPress={() => closeModal()}>
                  <Text className="text-white">Cancer</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Editor;
