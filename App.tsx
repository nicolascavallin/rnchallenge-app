import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";

import {
  useFonts,
  Spartan_400Regular,
  Spartan_500Medium,
  Spartan_600SemiBold,
} from "@expo-google-fonts/spartan";
import { AppProvider } from "./src/contexts/AppContext/context";

const Stack = createStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Spartan_400Regular,
    Spartan_500Medium,
    Spartan_600SemiBold,
  });
  if (!fontsLoaded)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </AppProvider>
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
