import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import ProductsScreen from "../screens/ProductsScreen";
import ProductCreateScreen from "../screens/ProductCreateScreen";
import ProductEditScreen from "../screens/ProductEditScreen";
import SalesScreen from "../screens/SalesScreen";
import ReportsScreen from "../screens/ReportsScreen";

const BottomTabs = createBottomTabNavigator();
const TopTabs = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

// ---- Mobile Tabs ----
function MobileTabs() {
  const theme = useTheme();
  return (
    <BottomTabs.Navigator
      screenOptions={ ({
        route,
      }: {
        route: { name: string };
      }): BottomTabNavigationOptions => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "apps";
          if (route.name === "Products") iconName = "cube-outline";
          else if (route.name === "Sales") iconName = "cash-outline";
          else if (route.name === "Reports") iconName = "bar-chart-outline";

          return <Ionicons name={ iconName } color={ color } size={ size } />;
        },
      }) }
    >
      <BottomTabs.Screen name="Products" component={ ProductsScreen } />
      <BottomTabs.Screen name="Sales" component={ SalesScreen } />
      <BottomTabs.Screen name="Reports" component={ ReportsScreen } />
    </BottomTabs.Navigator>
  );
}

// ---- Desktop Tabs ----
function DesktopTabs() {
  return (
    <TopTabs.Navigator>
      <TopTabs.Screen name="Products" component={ ProductsScreen } />
      <TopTabs.Screen name="Sales" component={ SalesScreen } />
      <TopTabs.Screen name="Reports" component={ ReportsScreen } />
    </TopTabs.Navigator>
  );
}

// ---- Root of Authenticated App ----
export default function AppNavigator() {
  const MainTabs = Platform.OS === "web" ? DesktopTabs : MobileTabs;

  return (
    <Stack.Navigator screenOptions={ { headerShown: false } }>
      <Stack.Screen name="MainTabs" component={ MainTabs } />
      <Stack.Screen name="ProductCreate" component={ ProductCreateScreen } />
      <Stack.Screen name="ProductEdit" component={ ProductEditScreen } />
    </Stack.Navigator>
  );
}
