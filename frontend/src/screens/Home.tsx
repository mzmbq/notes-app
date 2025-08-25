import { FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { HomeStackParamList, RootStackParamList, TabParamList } from "./Routes";
import { CompositeScreenProps, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import NoteCard from "../components/NoteCard";
import { fetchPaginatedNotes } from "../api/note";
import { useAuth } from "../hooks/useAuth";
import { log } from "../logger/logger";
import { Note } from "notes-app-types";
import useFetchBackend from "../hooks/useFetchBackend";
import { IconCirclePlus } from "@tabler/icons-react-native";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

const Home = ({ navigation }: Props) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const auth = useAuth();

  const {
    loading,
    error,
    doFetch: fetchMoreNotes,
  } = useFetchBackend(fetchPaginatedNotes);

  useEffect(() => {
    loadNotes();
  }, [page, auth]);

  const loadNotes = async () => {
    if (loading || !hasMore) return;

    if (!auth.state.authenticated || !auth.state.token) {
      log.error("[Home] Not authorized. Cannot load notes.");
      return;
    }
    const newNotes = await fetchMoreNotes({
      token: auth.state.token,
      pageNum: page,
    });
    setNotes((prevNotes) => [...prevNotes, ...newNotes]);
    if (newNotes.length === 0) {
      setHasMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleDeleted = async (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const renderItem = ({ item }: { item: Note }) => (
    <View className="px-4 py-2 w-full">
      <NoteCard
        note={item}
        onPress={() =>
          navigation.navigate("Editor", {
            note: item,
          })
        }
        tags={[]}
        onDeleted={handleDeleted}
      />
    </View>
  );

  const loadingMessage = (
    <View className="py-4">
      <Text className="text-center text-gray-500">Loading more notes...</Text>
    </View>
  );

  const noMoreNotesMessage = (
    <View className="py-4">
      <Text className="text-center text-gray-500">No more notes to load</Text>
    </View>
  );

  const listEmptyMessage = (
    <View className="py-8 px-4">
      <Text className="text-center text-gray-500 text-lg">No notes found</Text>
      <Text className="text-center text-gray-400 mt-2">
        Create a new note to get started
      </Text>
    </View>
  );
  return (
    <View className="relative w-full h-full">
      <View className="items-center bg-gray-100 pt-4 w-full">
        <Text className="text-xl font-bold text-blue-500">Home</Text>
        {error !== "" && <Text className="text-red-600">{error}</Text>}
        <FlatList
          className="w-full"
          data={notes}
          extraData={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            if (loading) {
              return loadingMessage;
            }
            if (!hasMore && notes.length > 0) {
              return noMoreNotesMessage;
            }
            return null;
          }}
          ListEmptyComponent={!loading && !error ? listEmptyMessage : null}
        />
      </View>
      <TouchableOpacity
        className="absolute bottom-10 right-10"
        onPress={() => navigation.navigate("Editor", {})}
      >
        <IconCirclePlus />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
