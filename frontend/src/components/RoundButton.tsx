import { Text, TouchableOpacity } from "react-native";
import React from "react";
import "../global.css";

type Props = {};

const RoundButton = (props: Props) => {
  return (
    <TouchableOpacity
      className="rounded-full bg-lime-500 p-4"
      onPress={() => alert("Button Pressed!")}
    >
      <Text className="text-xl ">Click Me</Text>
    </TouchableOpacity>
  );
};

export default RoundButton;
