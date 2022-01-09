import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HomeScreen from "./src/screens/HomeScreen";

if (Platform.OS === "android") {
  require("intl");
  require("intl/locale-data/jsonp/es");
}

import {
  useFonts,
  Spartan_400Regular,
  Spartan_500Medium,
  Spartan_600SemiBold,
} from "@expo-google-fonts/spartan";
import { AppProvider } from "./src/contexts/AppContext/context";
import ProductScreen from "./src/screens/ProductScreen";
import { Product } from "./src/contexts/AppContext/types";
import CreateProductScreen from "./src/screens/CreateProductScreen";

export type StackRoutesParams = {
  Home: never;
  Product: {
    data: Product;
  };
  Create: {
    data?: Product;
  };
};

const Stack = createStackNavigator<StackRoutesParams>();

export default function App() {
  let [fontsLoaded] = useFonts({
    Spartan_400Regular,
    Spartan_500Medium,
    Spartan_600SemiBold,
  });
  if (!fontsLoaded)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Spartan_600SemiBold",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            options={{ headerTitle: "Store" }}
            component={HomeScreen}
          />
          <Stack.Screen
            name="Create"
            options={{
              headerTitle: "",
              ...TransitionPresets.SlideFromRightIOS,
            }}
            component={CreateProductScreen}
          />
          <Stack.Screen
            name="Product"
            // options={{ headerTitle: "Store" }}
            options={{
              headerTitle: "",
              headerStyle: { shadowColor: "transparent" },
              ...TransitionPresets.SlideFromRightIOS,
            }}
            component={ProductScreen}
          />
        </Stack.Navigator>
      </AppProvider>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
