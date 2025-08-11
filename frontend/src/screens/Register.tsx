import { View, Text, Button } from "react-native";
import React from "react";
import { RootStackParamList } from "./Routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const Register = (props: Props) => {
  const naviation = props.navigation;

  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full">
      <Text className="text-xl font-bold text-blue-500">Register</Text>
      <Button
        title="Login"
        onPress={() => naviation.navigate("Login")}
      ></Button>
    </View>
  );
};

export default Register;
