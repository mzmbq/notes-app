import { Text, View } from "react-native";
import React from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "./Routes";

type Props = BottomTabScreenProps<TabParamList, "Settings">;

const Settings = (props: Props) => {
  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full">
      <Text className="text-xl font-bold text-blue-500">Settings</Text>
    </View>
  );
};

export default Settings;
