import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackRoutesParams } from "../../../App";
import { useApp } from "../../contexts/AppContext/hook";

type useRouteProp = RouteProp<StackRoutesParams, "Product">;

interface ProductScreenProps {
  navigation: StackNavigationHelpers;
}

const ProductScreen: FC<ProductScreenProps> = ({ navigation }) => {
  //
  const { setOptions } = useNavigation();
  const {
    params: { data },
  } = useRoute<useRouteProp>();
  const { bottom } = useSafeAreaInsets();

  const { removeProduct } = useApp();

  useEffect(() => {
    if (data) {
      setOptions({ headerTitle: data.name });
    } else {
      navigation.goBack();
    }
  }, []);

  const [status, setStatus] = useState<"ready" | "removing">("ready");
  const [imageLoaded, setImageLoaded] = useState(false);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      opacity: status === "ready" ? 1 : 0.5,
      //   backgroundColor: "#F9FAFB",
    },
    scrollView: {
      paddingBottom: bottom,
    },
    textTechSpec: {
      fontFamily: "Spartan_500Medium",
      marginTop: 4,
      color: "#00000080",
      fontSize: 11,
    },
  });

  const onEditTap = () => {
    // navigation.goBack();
    navigation.navigate("Create", { data });
  };

  const onRemoveTap = async () => {
    Alert.alert(
      "Remove product",
      `Are you sure that you want to remove "${data.name}"? This action cannot be undone.`,
      [
        {
          text: "Yes, remove",
          style: "destructive",
          onPress: onRemove,
        },
        {
          text: "No, cancel",
          style: "cancel",
        },
      ],
    );
  };

  const onRemove = async () => {
    setStatus("removing");
    setOptions({
      headerTitle: "Removing...",
      headerRight: () => (
        <View style={{ left: -16, bottom: 2 }}>
          <ActivityIndicator color="gray" />
        </View>
      ),
    });
    const res = await removeProduct(data.id);

    if (res) {
      navigation.navigate("Home");
    } else {
      Alert.alert(
        "",
        "There was an error and we can't remove the product. Please try again.",
      );
      setStatus("ready");
      setOptions({
        headerTitle: data.name,
        headerRight: undefined,
      });
    }
  };

  useEffect(
    () =>
      // @ts-ignore addListener exists on navigation object
      navigation.addListener("beforeRemove", (e) => {
        if (status === "ready" || e.data.action?.type === "NAVIGATE") {
          // Go back if is from code or status is ready
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      }),
    [navigation, status],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        endFillColor="#000000"
        contentContainerStyle={styles.scrollView}
        style={styles.root}
      >
        <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
          <View
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: data.imageFileName,
              }}
              resizeMode="cover"
              style={{
                flex: 1,
              }}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded ? (
              <View
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: 8,
                  width: "100%",
                  backgroundColor: "#EFEFEF",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                }}
              >
                <ActivityIndicator color="gray" />
              </View>
            ) : null}
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
            <Text
              style={{
                fontFamily: "Spartan_500Medium",
                marginTop: 8,
                fontSize: 15,
                color: "#FC6828",
              }}
            >
              {new Intl.NumberFormat("es", {
                style: "currency",
                currency: "EUR",
                useGrouping: true,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(data.price)}
            </Text>
          </View>
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
            style={{
              fontFamily: "Spartan_400Regular",
              color: "#00000080",
              fontSize: 14,
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            {data.description}
          </Text>

          <View style={{ marginTop: 12 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "Spartan_600SemiBold",
                color: "#00000080",
                fontSize: 11,
              }}
            >
              Tech Specs
            </Text>
            <Text numberOfLines={1} style={styles.textTechSpec}>
              Processor: {data.processor}
            </Text>
            <Text numberOfLines={1} style={styles.textTechSpec}>
              Screen: {data.screen}
            </Text>
            <Text numberOfLines={1} style={styles.textTechSpec}>
              Ram: {data.ram}
            </Text>
            <Text numberOfLines={1} style={styles.textTechSpec}>
              Color: {data.color}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignSelf: "center",
            marginVertical: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity disabled={status !== "ready"} onPress={onEditTap}>
            <Text
              style={{
                fontFamily: "Spartan_400Regular",
                color: "#000000BF",
                fontSize: 11,
                padding: 8,
                textAlign: "center",
              }}
            >
              Edit Product
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Spartan_400Regular",
              color: "#000000BF",
              fontSize: 11,
              paddingVertical: 8,
              textAlign: "center",
            }}
          >
            |
          </Text>
          <TouchableOpacity disabled={status !== "ready"} onPress={onRemoveTap}>
            <Text
              style={{
                fontFamily: "Spartan_400Regular",
                color: "#000000BF",
                fontSize: 11,
                padding: 8,
                textAlign: "center",
              }}
            >
              Remove product
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductScreen;
