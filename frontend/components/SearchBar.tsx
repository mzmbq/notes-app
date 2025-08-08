import { TextInput } from "react-native";
import React from "react";

type Props = {};

const SearchBar = (props: Props) => {
  return (
    <TextInput
      className="border border-gray-300 rounded-lg p-2"
      placeholder="Search notes..."
      placeholderTextColor={"#999"}
    />
  );
};

export default SearchBar;
