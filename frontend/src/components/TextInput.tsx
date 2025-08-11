import React from "react";
import { TextInputProps, TextInput as TextInputRN } from "react-native";

type Props = TextInputProps & {
  placeholder: string;
};

const TextInput = ({ placeholder = "", ...props }: Props) => {
  return (
    <TextInputRN
      className="border border-gray-300 rounded-lg p-2"
      placeholder={placeholder}
      placeholderTextColor={"#999"}
      {...props}
    />
  );
};

export default TextInput;
