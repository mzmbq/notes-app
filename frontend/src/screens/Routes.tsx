import React from "react";
import Home from "./Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Settings from "./Settings";
import {
  IconHome,
  IconHomeFilled,
  IconSettings,
  IconSettingsFilled,
  IconStar,
  IconStarFilled,
  IconUsers,
} from "@tabler/icons-react-native";

import { createTabIcon } from "../utils/icons";
import Favorites from "./Favorites";
import Shared from "./Shared";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import Register from "./Register";
import Editor from "./Editor";
import { Note } from "notes-app-types";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="MainTabs" component={Tabs} />
    </Stack.Navigator>
  );
};

export type HomeStackParamList = {
  Home: undefined;
  Editor: { note?: Note };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Editor" component={Editor} />
    </HomeStack.Navigator>
  );
};

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
  Favorites: undefined;
  Shared: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          title: "",
          tabBarIcon: createTabIcon(IconHome, IconHomeFilled),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: "",
          tabBarIcon: createTabIcon(IconStar, IconStarFilled),
        }}
      />
      <Tab.Screen
        name="Shared"
        component={Shared}
        options={{
          title: "",
          tabBarIcon: createTabIcon(IconUsers),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "",
          tabBarIcon: createTabIcon(IconSettings, IconSettingsFilled),
        }}
      />
    </Tab.Navigator>
  );
};

export default Routes;
