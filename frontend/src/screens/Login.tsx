import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import { RootStackParamList } from "./Routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import TextInput from "../components/TextInput";
import { fetchLogin } from "../api/user";
import { log } from "../logger/logger";
import { logError } from "../utils/errors";
import useFetchBackend from "../hooks/useFetchBackend";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const Login = (props: Props) => {
  const naviation = props.navigation;
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    response: user,
    loading,
    error,
    doFetch: login,
  } = useFetchBackend(fetchLogin);

  const handleLogin = async () => {
    try {
      const resp = await login({
        username: username,
        password: password,
      });
      // TODO: store the token in some state
      log.info("Signed in as", resp.username);
    } catch (err) {
      logError(err, "Login failed");
    }
  };

  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full gap-y-1">
      <Text className="text-xl font-bold text-blue-500">Login</Text>

      {loading && <Text>Loading...</Text>}
      <View className="flex w-[75%] gap-y-1">
        <TextInput placeholder="Email" onChangeText={setEmail}></TextInput>
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={true}
        ></TextInput>
        <Button title="Login" onPress={handleLogin}></Button>
        <Text className="text-red-600">{error}</Text>
        {user && (
          <Text className="text-green-500">
            Signed in as user: {user.username}
          </Text>
        )}
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
