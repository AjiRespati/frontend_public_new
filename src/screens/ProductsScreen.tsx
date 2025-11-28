import React from "react";
import { FlatList, View } from "react-native";
import { Text, Appbar, ActivityIndicator, Card } from "react-native-paper";
import { useProducts } from "../api/useProducts";

export default function ProductsScreen() {
  const { data, isLoading, error } = useProducts();

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Products" />
      </Appbar.Header>

      {isLoading && (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator animating={true} />
        </View>
      )}

      {error && (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ color: "red", textAlign: "center" }}>
            Failed to fetch products
          </Text>
        </View>
      )}

      {data && (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 10 }}>
              <Card.Title title={item.name} subtitle={`Stock: ${item.stock}`} />
              <Card.Content>
                <Text>Price: ${item.price}</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
}
