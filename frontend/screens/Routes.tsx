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
  IconWorldShare,
} from "@tabler/icons-react-native";

import { createTabIcon } from "../utils/icons";
import Favorites from "./Favorites";
import Shared from "./Shared";

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
  Favorites: undefined;
  Shared: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const Routes = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
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
