import React, { FC, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, {
  CurvedTransition,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";
import { Product } from "../../contexts/AppContext/types";

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,

    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#0000000D",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2.22,

    elevation: 3,
    borderColor: "#0C1A4B1A",
    borderWidth: 1,
  },
});

interface ProductTileProps {
  data: Product;
  index: number;
}

const ProductTile: FC<ProductTileProps> = ({ data, index }) => {
  //
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Animated.View
      key={data.id}
      entering={FadeInUp.delay(60 * index)}
      exiting={FadeOut}
      layout={CurvedTransition}
    >
      <TouchableOpacity activeOpacity={0.5} style={style.container}>
        <View>
          <Image
            source={{
              uri: data.imageFileName,
            }}
            resizeMode="cover"
            style={{
              width: 72,
              height: 72,
              borderRadius: 4,
            }}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded ? (
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 4,
                backgroundColor: "#EFEFEF",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
              }}
            >
              <ActivityIndicator />
            </View>
          ) : null}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-evenly",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Spartan_600SemiBold",
                  color: "#00000080",
                  fontSize: 11,
                }}
              >
                {data.manufacturer}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Spartan_600SemiBold",
                  color: "#000000",
                  fontSize: 18,
                }}
              >
                {data.name}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Spartan_500Medium",
                marginTop: 8,
                fontSize: 15,
                color: "#FC6828",
              }}
            >
              {data.price.toLocaleString("es", {
                style: "currency",
                maximumFractionDigits: 0,
                currency: "EUR",
                useGrouping: true,
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProductTile;
