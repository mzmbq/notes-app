import { View, Text, Button } from "react-native";
import React from "react";
import { RootStackParamList } from "./Routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import TextInput from "../components/TextInput";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const Login = (props: Props) => {
  const naviation = props.navigation;
  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full gap-y-1">
      <Text className="text-xl font-bold text-blue-500">Login</Text>

      <View className="flex w-[75%] gap-y-1">
        <TextInput placeholder="Email"></TextInput>
        <TextInput placeholder="Password" secureTextEntry={true}></TextInput>
        <Button title="Login"></Button>
      </View>

      <Button
        title="Register"
        onPress={() => naviation.navigate("Register")}
      ></Button>
      <Button
        title="Skip"
        onPress={() => naviation.navigate("MainTabs")}
      ></Button>
    </View>
  );
};

export default Login;
