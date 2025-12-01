import React from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";
import ProductForm from "../components/ProductForm";
import api from "../api/client";
import { useQueryClient } from "@tanstack/react-query";
import AppHeader from "../components/AppHeader";
import { globalStyles } from "../utils/globalStyles";

export default function ProductEditScreen({ route, navigation }: any) {
  const { product } = route.params;
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any, image: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    if (image && image.uri) {
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: "product.jpg",
      } as any);
    }

    await api.put(`/products/${product.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    queryClient.invalidateQueries({ queryKey: ["products"] });
    navigation.goBack();
  };

  return (
    <View style={ [globalStyles.screen, { justifyContent: "center" }] }>
      <View style={ [globalStyles.card, { paddingVertical: 32 }] }>
    <AppHeader title="Edit Product" back/>
      {/* <Appbar.Header>
        <Appbar.BackAction onPress={ () => navigation.goBack() } />
        <Appbar.Content title="Edit Product" />
      </Appbar.Header> */}
      <ProductForm
        onSubmit={ handleSubmit }
        initialValues={ product }
        submitLabel="Update"
      />
    </View>
    </View>
  );
}
