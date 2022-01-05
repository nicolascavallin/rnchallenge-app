import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import ProductTile from "../../components/ProductTile";

interface HomeScreenProps {
  navigation: StackNavigationHelpers;
}

const HomeScreen: FC<HomeScreenProps> = ({ children }) => {
  //
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#FFF",
      // alignItems: "center",
      // justifyContent: "center",
    },
  });

  return (
    <View style={styles.root}>
      <Text>Hola</Text>

      <ProductTile />
      <ProductTile />
      <ProductTile />
      <ProductTile />
      <ProductTile />
      <ProductTile />
    </View>
  );
};

export default HomeScreen;
