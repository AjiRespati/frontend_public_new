import React from "react";
import { FlatList, View } from "react-native";
import { Text, Appbar, ActivityIndicator, Card, IconButton } from "react-native-paper";
import { useProducts } from "../api/useProducts";
import api from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductsScreen({ navigation }: any) {
  const { data, isLoading, error } = useProducts();
  const queryClient = useQueryClient();

  const handleDelete = async (id: number) => {
    await api.delete(`/products/${id}`);
    queryClient.invalidateQueries({queryKey : ["products"]});
  };

  return (
    <View style={ { flex: 1 } }>
      <Appbar.Header>
        <Appbar.Content title="Products" />
        <Appbar.Action
          icon="plus"
          onPress={ () => navigation.navigate("ProductCreate") }
        />
      </Appbar.Header>

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
            <Card style={ { marginBottom: 10 } }>
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
                <Text>Price: ${ item.price }</Text>
              </Card.Content>
            </Card>
          ) }
        />
      ) }
    </View>
  );
}
