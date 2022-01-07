import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import React, { FC } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductTile from "../../components/ProductTile";
import { useApp } from "../../contexts/AppContext/hook";

interface HomeScreenProps {
  navigation: StackNavigationHelpers;
}

const HomeScreen: FC<HomeScreenProps> = ({ children }) => {
  //
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#F9FAFB",
      // alignItems: "center",
      // justifyContent: "center",
    },
  });

  const { status, products } = useApp();

  return (
    <View style={styles.root}>
      {status === "loading" ? (
        <ActivityIndicator
          style={{ alignSelf: "center", paddingTop: 100 }}
          color="black"
        />
      ) : null}
      <FlatList
        contentContainerStyle={{ paddingTop: 100 }}
        data={products}
        renderItem={(item) => (
          <ProductTile index={item.index} data={item.item} />
        )}
      />
    </View>
  );
};

export default HomeScreen;
