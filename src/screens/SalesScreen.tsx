import React from "react";
import { View, FlatList } from "react-native";
import { Appbar, Card, Button, Text, Divider } from "react-native-paper";
import { useProducts } from "../api/useProducts";
import { useCartStore } from "../store/cartStore";
import api from "../api/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

export default function SalesScreen() {
  const { data: products, isLoading } = useProducts();
  const {
    items,
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    total,
  } = useCartStore();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    const payload = {
      items: items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
        price: i.price,
      })),
      total,
    };
    await api.post("/sales", payload);
    clearCart();
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Sales" />
        {items.length > 0 && (
          <Appbar.Action icon="delete" onPress={clearCart} />
        )}
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      <FlatList
        data={products || []}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <Card
            style={{
              flex: 1,
              margin: 5,
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <Card.Title title={item.name} />
            <Card.Content>
              <Text>Stock: {item.stock}</Text>
              <Text>Price: ${item.price}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() =>
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    stock: item.stock,
                  })
                }
              >
                Add
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      <Divider />
      <View style={{ padding: 16 }}>
        <Text variant="titleMedium" style={{ marginBottom: 10 }}>
          Cart
        </Text>
        {items.length === 0 ? (
          <Text>No items yet.</Text>
        ) : (
          items.map((i) => (
            <View
              key={i.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text>
                {i.name} x{i.quantity}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Button onPress={() => decreaseQty(i.id)}>-</Button>
                <Button onPress={() => increaseQty(i.id)}>+</Button>
                <Button onPress={ () => removeItem(i.id) } icon="delete" children={ undefined } />
              </View>
            </View>
          ))
        )}

        <Divider style={{ marginVertical: 10 }} />
        <Text variant="titleMedium">Total: ${total.toFixed(2)}</Text>

        <Button
          mode="contained"
          disabled={items.length === 0}
          onPress={handleCheckout}
          style={{ marginTop: 10 }}
        >
          Checkout
        </Button>
      </View>
    </View>
  );
}
