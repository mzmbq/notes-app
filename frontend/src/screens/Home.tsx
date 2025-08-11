import { Button, Text, View } from "react-native";
import React from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList, TabParamList } from "./Routes";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

const Home = (props: Props) => {
  const navigation = props.navigation;
  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full">
      <Text className="text-xl font-bold text-blue-500">Home</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")}
      ></Button>
    </View>
  );
};

export default Home;
