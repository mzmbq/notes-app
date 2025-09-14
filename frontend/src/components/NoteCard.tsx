import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Note, Tag } from "notes-app-types";
import { IconTrash } from "@tabler/icons-react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { fetchDeleteNote } from "../api/note";
import { log } from "../logger/logger";
import { useAuth } from "../hooks/useAuth";
import useFetchBackend from "../hooks/useFetchBackend";
import { fetchTagsByNote } from "../api/tag";
import TagPill from "./Tag";

type Props = {
  note: Note;
  onPress?: (event: GestureResponderEvent) => void;
  tags: Tag[];
  onDeleted?: (id: Note["id"]) => void;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// TODO: implement
const NoteCard = (props: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);
  // Shared values for blur intensity and dark overlay opacity
  const blur = useSharedValue(0);
  const dimOpacity = useSharedValue(0);
  const auth = useAuth();
  // Animate when modalVisible changes
  useEffect(() => {
    if (modalVisible) {
      blur.value = withTiming(30, { duration: 100 }); // Ziel-Blur
      dimOpacity.value = withTiming(0.2, { duration: 100 }); // Ziel-Opacity
    } else {
      blur.value = withTiming(0, { duration: 100 });
      dimOpacity.value = withTiming(0, { duration: 100 });
    }
  }, [modalVisible]);

  // Animated props for BlurView: intensity ist animierbar über Animated.createAnimatedComponent
  const blurProps = useAnimatedProps(() => ({ intensity: blur.value }));

  // Animated style für dunklen Overlay
  const dimStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0,0,0,${dimOpacity.value})`,
  }));

  const {
    loading,
    error,
    doFetch: deleteNote,
  } = useFetchBackend(fetchDeleteNote);

  const handleDelete = async () => {
    try {
      if (!auth.state.authenticated || !auth.state.token) {
        log.error("[Home] Not authorized. Cannot load notes.");
        return;
      }
      await deleteNote({ id: props.note.id, token: auth.state.token });
      if (props.onDeleted) {
        props.onDeleted(props.note.id);
      }
    } catch (err) {
      log.error(err);
    } finally {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    getTagsByNote();
  }, [props.note]);

  const getTagsByNote = async () => {
    try {
      const tags = await fetchTagsByNote(props.note.id);
      setTags(tags);
    } catch (err) {
      log.error(err);
    }
  };

  return (
    <>
      <View className="bg-slate-300 border-solid border-black rounded-xl w-full p-2 flex flex-row justify-between">
        <TouchableOpacity className="w-[85%]" onPress={props.onPress}>
          <Text className="text-xl font-bold flex flex-row">
            {props.note.title}
          </Text>
          {props.note.content !== "" && <Text>{props.note.content}</Text>}

          <View className="flex flex-row gap-1 mt-2 flex-wrap">
            {props.tags.map((t) => (
              <TagPill tag={t} key={t.id} isActive={true} />
            ))}
          </View>
        </TouchableOpacity>
        <Pressable onPress={() => setModalVisible(true)}>
          <IconTrash className="size-10 text-black" />
        </Pressable>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 backdrop-blur-sm">
          <AnimatedBlurView
            animatedProps={blurProps}
            className="absolute inset-0"
            tint="systemThinMaterial"
          />
          <Animated.View style={[StyleSheet.absoluteFill, dimStyle]} />

          <View className="flex-1 justify-center items-center">
            <View className="m-20 bg-slate-600 border rounded-2xl p-5 w-[300px]">
              <Text className="text-white mb-4 text-3xl">Delete Note?</Text>
              <View className="flex flex-row gap-4">
                <Pressable
                  className="border border-white rounded-lg flex-1 justify-center items-center p-2"
                  onPress={() => {
                    handleDelete();
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-white">Delete</Text>
                </Pressable>
                <Pressable
                  className="border border-white rounded-lg flex-1 justify-center items-center p-2"
                  onPress={() => setModalVisible(false)}
                >
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

export default NoteCard;
