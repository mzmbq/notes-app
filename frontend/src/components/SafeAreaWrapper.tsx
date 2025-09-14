import { Platform, SafeAreaView as SafeAreaViewIos, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: any;
};

const SafeAreaWrapper = ({ children, className, style }: Props) => {
  if (Platform.OS === "web") {
    return (
      <View className={className} style={style}>
        {children}
      </View>
    );
  }

  if (Platform.OS === "ios") {
    return (
      <SafeAreaViewIos className={className} style={style}>
        {children}
      </SafeAreaViewIos>
    );
  }

  return (
    <SafeAreaView className={className} style={style}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
