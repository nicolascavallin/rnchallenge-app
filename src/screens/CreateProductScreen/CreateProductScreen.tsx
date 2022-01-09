import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import React, { FC, useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  useForm,
} from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackRoutesParams } from "../../../App";
import * as ImagePicker from "expo-image-picker";
import { environmentUrl } from "../../contexts/AppContext/api";
import { useApp } from "../../contexts/AppContext/hook";

const CustomTextInput: FC<{
  control: Control<FieldValues, object>;
  name: string;
  title: string;
  error?: FieldError;
  onSubmitEditing: () => void;
  register: any;
  lastField?: boolean;
  isPrice?: boolean;
}> = ({
  control,
  name,
  title,
  error,
  register,
  onSubmitEditing,
  lastField,
  isPrice,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: "Spartan_600SemiBold",
          color: "#00000080",
          fontSize: 11,
        }}
      >
        {title}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={{
          required: true,
          //   pattern: isPrice ? /^([1-9][0-9]+|[1-9])$/gm : undefined,
          min: isPrice ? 0 : undefined,
          minLength: !isPrice ? 1 : undefined,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            {...register(name)}
            style={{
              marginTop: 6,
              backgroundColor: "#FFFFFF",
              padding: 8,
              borderRadius: 6,
              fontFamily: "Spartan_400Regular",
              fontSize: 14,
              lineHeight: 16,
              borderColor: error ? "#FF000080" : "#0C1A4B1A",
              borderWidth: 1,
            }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={lastField ? "done" : "next"}
            keyboardType={isPrice ? "number-pad" : "default"}
          />
        )}
      />
      {error ? (
        <Text
          style={{
            fontFamily: "Spartan_400Regular",
            fontSize: 10,
            color: "#FF000080",
            marginTop: 8,
          }}
        >
          {error.type === "required"
            ? `${title} is required`
            : `${title} should be a number`}
        </Text>
      ) : null}
    </View>
  );
};

type useRouteProp = RouteProp<StackRoutesParams, "Product">;

interface ComponentNameProps {
  navigation: StackNavigationHelpers;
}

const ComponentName: FC<ComponentNameProps> = ({ navigation }) => {
  //
  const { setOptions } = useNavigation();
  const { params } = useRoute<useRouteProp>();

  const { bottom } = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setFocus,
    register,
  } = useForm({
    defaultValues: {
      name: params?.data ? params.data.name : "",
      manufacturer: params?.data ? params.data.manufacturer : "",
      price: params?.data ? params.data.price.toString() : "",
      description: params?.data ? params.data.description : "",
      processor: params?.data ? params.data.processor : "",
      ram: params?.data ? params.data.ram : "",
      screen: params?.data ? params.data.screen : "",
      color: params?.data ? params.data.color : "",
    },
    mode: "onBlur",
  });

  const { postProduct } = useApp();

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const [loadingForm, setLoadingForm] = useState(false);

  const valid = params?.data
    ? isValid &&
      image &&
      (isDirty || image !== params.data.imageFileName) &&
      image.length > 10
    : isValid && isDirty && image && image.length > 10;

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#F9FAFB",
      padding: 16,
      //   opacity: status === "ready" ? 1 : 0.5,
    },
    scrollView: {
      paddingBottom: bottom + 32,
    },
    textTechSpec: {
      fontFamily: "Spartan_500Medium",
      marginTop: 4,
      color: "#00000080",
      fontSize: 11,
    },
  });

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!res.cancelled) {
      setUnsavedChanges(true);
      setLoadingImage(true);
      setImage("loading");

      const localUri = res.uri;
      const filename = localUri.split("/").pop() as string;

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("photo", {
        // @ts-ignore
        uri: localUri,
        name: filename,
        type,
      });

      await fetch(`${environmentUrl}/api/phones/picture`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "content-type": "multipart/form-data",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setImage(res.url);
          }
        })
        .catch((x) => null);
      // .then((x) => console.log(x));
    }
  };

  //   const onSubmit = (data: any) => console.log(data);
  const onSubmit = async (data: any) => {
    // console.log(errors, isDirty, isValid);
    // if (valid) {
    setLoadingForm(true);
    setOptions({
      headerTitle: "Uploading...",
      headerRight: () => (
        <View style={{ left: -16, bottom: 2 }}>
          <ActivityIndicator color="gray" />
        </View>
      ),
    });

    await postProduct({
      id: params?.data ? params.data.id : undefined,
      ...data,
      imageFileName: image,
    })
      .then((res) => {
        if (res) {
          if (params?.data) {
            navigation.navigate("Product", { data: res });
          } else {
            navigation.navigate("Home");
          }
        }
      })
      .catch((err) => console.log("err,", err));
    // }
  };

  useEffect(() => {
    if (params?.data) {
      setOptions({ headerTitle: "Edit product" });
      setLoadingImage(true);
      setImage(params.data.imageFileName);
    } else {
      setOptions({ headerTitle: "Create product" });
      setFocus("name");
    }
  }, []);

  useEffect(() =>
    // @ts-ignore addListener exists on navigation object
    navigation.addListener(
      "beforeRemove",
      // @ts-ignore event exists
      (e) => {
        if (!unsavedChanges || e.data.action?.type === "NAVIGATE") {
          return;
        }

        e.preventDefault();

        if (!loadingForm)
          Alert.alert(
            "Discard changes?",
            "You have unsaved changes. Are you sure to discard them and leave the screen?",
            [
              { text: "Don't leave", style: "cancel", onPress: () => null },
              {
                text: "Discard",
                style: "destructive",
                onPress: () => navigation.dispatch(e.data.action),
              },
            ],
          );
      },
      [navigation, unsavedChanges, loadingForm],
    ),
  );

  useEffect(() => {
    if (isDirty) {
      setUnsavedChanges(true);
    }
  }, [isDirty]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scrollView}>
      <CustomTextInput
        // @ts-ignore
        control={control}
        name="name"
        register={register}
        title="Name"
        error={errors?.name}
        onSubmitEditing={() => {
          try {
            setFocus("manufacturer");
          } catch (error) {
            console.log("err", error);
          }
        }}
      />

      <CustomTextInput
        // @ts-ignore
        control={control}
        name="manufacturer"
        register={register}
        title="Manufacturer"
        error={errors?.manufacturer}
        onSubmitEditing={() => setFocus("price")}
      />

      <CustomTextInput
        // @ts-ignore
        control={control}
        name="price"
        register={register}
        title="Price"
        isPrice
        error={errors?.price}
        onSubmitEditing={() => setFocus("description")}
      />

      <CustomTextInput
        // @ts-ignore
        control={control}
        name="description"
        register={register}
        title="Description"
        error={errors?.description}
        onSubmitEditing={() => setFocus("color")}
      />

      <CustomTextInput
        // @ts-ignore
        control={control}
        name="color"
        register={register}
        title="Color"
        error={errors?.color}
        onSubmitEditing={() => setFocus("screen")}
      />

      <CustomTextInput
        // @ts-ignore
        control={control}
        name="screen"
        register={register}
        title="Screen"
        error={errors?.screen}
        onSubmitEditing={() => setFocus("processor")}
      />

      <CustomTextInput
        // @ts-ignore
        control={control}
        name="processor"
        register={register}
        title="Processor"
        error={errors?.processor}
        onSubmitEditing={() => setFocus("ram")}
      />

      <CustomTextInput
        // @ts-ignore
        control={control}
        name="ram"
        register={register}
        title="Ram"
        error={errors?.ram}
        onSubmitEditing={() => null}
        lastField
      />

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={pickImage}
        disabled={image === "loading"}
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#EFEFEF",
          borderColor: "#0C1A4B1A",
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: image ?? "loading",
          }}
          resizeMode="cover"
          style={{
            flex: 1,
            width: "100%",
          }}
          onLoad={() => setLoadingImage(false)}
        />
        <Image
          source={
            !image ? require("../../assets/add-photo.png") : { uri: "null" }
          }
          resizeMode="cover"
          style={{
            width: 30,
            height: 30,
            position: "absolute",
          }}
        />
        {loadingImage ? (
          <ActivityIndicator style={{ position: "absolute" }} color="gray" />
        ) : null}
      </TouchableOpacity>

      <View style={{ opacity: loadingForm || !valid ? 0.5 : 1 }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            width: "100%",
            backgroundColor: "#FC6828",
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: "center",
            marginTop: 32,
          }}
          onPress={handleSubmit(onSubmit)}
          disabled={loadingForm || !valid}
        >
          <Text
            style={{
              fontFamily: "Spartan_600SemiBold",
              color: "#FFFFFF",
              fontSize: 18,
            }}
          >
            {params?.data ? "Edit" : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ComponentName;
