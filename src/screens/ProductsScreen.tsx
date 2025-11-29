import React from "react";
import { FlatList, View } from "react-native";
import { Text, Appbar, ActivityIndicator, Card, IconButton } from "react-native-paper";
import { useProducts } from "../api/useProducts";
import api from "../api/client";
import { useQueryClient } from "@tanstack/react-query";
import AppHeader from "../components/AppHeader";
import { globalStyles } from "../utils/globalStyles";

export default function ProductsScreen({ navigation }: any) {
  const { data, isLoading, error } = useProducts();
  const queryClient = useQueryClient();

  const handleDelete = async (id: number) => {
    await api.delete(`/products/${id}`);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <View style={ { flex: 1 } }>
      <AppHeader title="Products" />

      {/* <Appbar.Header>
        <Appbar.Content title="Products" />
        <Appbar.Action
          icon="plus"
          onPress={ () => navigation.navigate("ProductCreate") }
        />
      </Appbar.Header> */}

      { isLoading && (
        <View style={ { flex: 1, justifyContent: "center" } }>
          <ActivityIndicator animating={ true } />
        </View>
      ) }

      { error && (
        <Text style={ { color: "red", textAlign: "center" } }>
          Failed to load products
        </Text>
      ) }

      { data && (
        <FlatList
          data={ data }
          keyExtractor={ (item) => String(item.id) }
          contentContainerStyle={ { padding: 10 } }
          renderItem={ ({ item }) => (
            <Card style={ [globalStyles.card, { marginBottom: 16 }] }>
              <Card.Cover source={ { uri: item.image } } style={ { borderRadius: 16 } } />
              <Card.Title
                title={ item.name }
                subtitle={ `Stock: ${item.stock}` }
                right={ () => (
                  <View style={ { flexDirection: "row" } }>
                    <IconButton
                      icon="pencil"
                      onPress={ () => navigation.navigate("ProductEdit", { product: item }) }
                    />
                    <IconButton
                      icon="delete"
                      onPress={ () => handleDelete(item.id) }
                    />
                  </View>
                ) }
              />
              <Card.Content>
                <Text variant="titleMedium" style={ { color: "#555", marginTop: 8 } }>Price: ${ item.price }</Text>
              </Card.Content>
            </Card>
          ) }
        />
      ) }
    </View>
  );
}
