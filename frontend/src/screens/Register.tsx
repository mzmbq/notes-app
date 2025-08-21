import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import { RootStackParamList } from "./Routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useFetchBackend from "../hooks/useFetchBackend";
import { fetchSignUp } from "../api/user";
import TextInput from "../components/TextInput";
import { logError } from "../utils/errors";
import { log } from "../logger/logger";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const Register = (props: Props) => {
  const naviation = props.navigation;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const {
    response: signUpResponse,
    loading,
    error,
    doFetch: register,
  } = useFetchBackend(fetchSignUp);

  const handleRegister = async () => {
    if (password != passwordRepeat) {
      log.error("Passwords do no match");
      return;
    }
    try {
      const resp = await register({
        username: username,
        email: email,
        password: password,
      });
      log.info("Created a new user:", resp.id);
    } catch (err) {
      logError(err, "Register Failed");
    }
  };

  return (
    <View className="flex-1 items-center bg-gray-100 pt-4 w-full">
      <Text className="text-xl font-bold text-blue-500">Register</Text>

      {loading && <Text>Loading...</Text>}
      <View className="flex w-[75%] gap-y-1">
        <TextInput
          placeholder="Username"
          onChangeText={setUsername}
        ></TextInput>
        <TextInput placeholder="Email" onChangeText={setEmail}></TextInput>
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={true}
        ></TextInput>
        <TextInput
          placeholder="Repeat Password"
          onChangeText={setPasswordRepeat}
          secureTextEntry={true}
        ></TextInput>
        <Button title="Register" onPress={handleRegister}></Button>
        <Text className="text-red-600">{error}</Text>
        {signUpResponse && (
          <Text className="text-green-500">
            Created a new user: {signUpResponse.id}
          </Text>
        )}
      </View>

      <Button
        title="Login"
        onPress={() => naviation.navigate("Login")}
      ></Button>
    </View>
  );
};

export default Register;
