import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import React, { FC, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  CurvedTransition,
  FadeInUp,
  FadeOut,
  FadeOutUp,
} from "react-native-reanimated";
import ProductTile from "../../components/ProductTile";
import { useApp } from "../../contexts/AppContext/hook";

interface HomeScreenProps {
  navigation: StackNavigationHelpers;
}

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  //
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#F9FAFB",
    },
  });

  const { status, products } = useApp();

  const renderItem = useCallback(
    (item) => <ProductTile index={item.index} data={item.item} />,
    [],
  );
  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.root}>
      <FlatList
        contentContainerStyle={{ paddingTop: 16 }}
        data={products}
        ListHeaderComponent={() => {
          return status === "loading" ? (
            <ActivityIndicator
              style={{ alignSelf: "center", paddingTop: 16 }}
              color="gray"
            />
          ) : (
            <View />
          );
        }}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={() =>
          status === "ready" && products.length >= 0 ? (
            <Animated.View
              key="add-action"
              layout={CurvedTransition}
              entering={FadeInUp.delay(60 * products.length)}
              exiting={FadeOut}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("Create")}
                style={{
                  alignSelf: "center",
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily:
                      products.length > 0
                        ? "Spartan_400Regular"
                        : "Spartan_600SemiBold",
                    color: "#000000BF",
                    fontSize: products.length > 0 ? 11 : 14,
                    padding: 8,
                    textAlign: "center",
                  }}
                >
                  {products.length > 0
                    ? "Not the one you are looking for? Add a product"
                    : "No products, tap here and add one!"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : null
        }
      />
    </View>
  );
};

export default HomeScreen;
