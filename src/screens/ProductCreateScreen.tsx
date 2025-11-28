import React from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";
import ProductForm from "../components/ProductForm";
import api from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductCreateScreen({ navigation }: any) {
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any, image: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    if (image) {
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: "product.jpg",
      } as any);
    }

    await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    queryClient.invalidateQueries({ queryKey: ["products"] });
    navigation.goBack();
  };

  return (
    <View style={ { flex: 1 } }>
      <Appbar.Header>
        <Appbar.BackAction onPress={ () => navigation.goBack() } />
        <Appbar.Content title="Add Product" />
      </Appbar.Header>
      <ProductForm onSubmit={ handleSubmit } submitLabel="Create" />
    </View>
  );
}
