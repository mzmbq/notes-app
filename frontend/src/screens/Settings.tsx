import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList, TabParamList } from "./Routes";
import { useAuth } from "../hooks/useAuth";
import { log } from "../logger/logger";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Settings">,
  NativeStackScreenProps<RootStackParamList>
>;

const Settings = (props: Props) => {
  const auth = useAuth();
  const navigation = props.navigation;
  log.debug("[Settings] AuthState:", auth.state);

  const handleSignOut = async () => {
    log.info("[Settings] Signing out");
    await auth.signOut();
    navigation.navigate("Login");
  };

  const currentUserTxt = (
    <>
      <Text className="text-m">
        Signed in as:{" "}
        <Text className="font-bold text-blue-500">{auth.state.username}</Text>
      </Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text className="text-m underline text-blue-900">Sign out</Text>
      </TouchableOpacity>
    </>
  );

  const notSignedInTxt = (
    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
      <Text className="text-m underline text-blue-900">Sign in</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full">
      <Text className="text-xl font-bold text-blue-500">Settings</Text>
      {auth.state.authenticated ? currentUserTxt : notSignedInTxt}
    </View>
  );
};

export default Settings;
