import React, { FC } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

interface ProductTileProps {}

const ProductTile: FC<ProductTileProps> = ({ children }) => {
  //

  return (
    <TouchableOpacity style={style.container}>
      <Image
        source={{
          uri: "https://rg.dutyfreeshopatlanticosur.com/media/catalog/product/cache/7c9e7eea87f55c85e452c480e14505af/1/9/199253_1.jpg",
        }}
        resizeMode="cover"
        style={{
          width: 72,
          height: 72,
          borderRadius: 8,
        }}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text>Apple</Text>
            <Text>iPhone 7</Text>
          </View>
          <Text>$120</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductTile;
