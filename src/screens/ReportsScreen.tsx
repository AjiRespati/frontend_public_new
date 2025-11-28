import React, { useState } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import {
  Appbar,
  Card,
  Text,
  ActivityIndicator,
  Divider,
  SegmentedButtons,
} from "react-native-paper";
import { useSalesStats } from "../api/useSalesStats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ReportsScreen() {
  const [range, setRange] = useState(7);
  const { data, isLoading, error, refetch } = useSalesStats(range);
  const screenWidth = Dimensions.get("window").width;

  const handleChangeRange = (value: string) => {
    const num = parseInt(value, 10);
    setRange(num);
    refetch();
  };

  if (isLoading) {
    return (
      <View style={ { flex: 1, justifyContent: "center" } }>
        <ActivityIndicator animating={ true } />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={ { flex: 1, justifyContent: "center" } }>
        <Text style={ { textAlign: "center", color: "red" } }>
          Failed to load reports.
        </Text>
      </View>
    );
  }

  const summary = data.summary || {};
  const dailySales = (data.dailySales || []).map((d: any) => ({
    date: new Date(d.date).toLocaleDateString(),
    revenue: parseFloat(d.revenue),
  }));
  const topProducts = data.topProducts || [];

  return (
    <ScrollView style={ { flex: 1 } }>
      <Appbar.Header>
        <Appbar.Content title="Reports & Analytics" />
      </Appbar.Header>

      <View style={ { padding: 16 } }>
        {/* Range Selector */ }
        <SegmentedButtons
          value={ String(range) }
          onValueChange={ handleChangeRange }
          buttons={ [
            { value: "7", label: "7d" },
            { value: "30", label: "30d" },
            { value: "90", label: "90d" },
          ] }
          style={ { marginBottom: 16 } }
        />

        {/* Summary Cards */ }
        <Card style={ { marginBottom: 16 } }>
          <Card.Content>
            <Text variant="titleMedium">Total Sales</Text>
            <Text variant="headlineMedium">{ summary.totalSales || 0 }</Text>
          </Card.Content>
        </Card>

        <Card style={ { marginBottom: 16 } }>
          <Card.Content>
            <Text variant="titleMedium">Total Revenue</Text>
            <Text variant="headlineMedium">
              ${ Number(summary.totalRevenue || 0).toFixed(2) }
            </Text>
          </Card.Content>
        </Card>

        <Divider style={ { marginVertical: 16 } } />

        {/* Revenue Chart */ }
        <Text variant="titleMedium" style={ { marginBottom: 8 } }>
          Revenue (Last { range } Days)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={ false }>
          <View style={ { height: 250, width: Math.max(600, screenWidth - 32) } }>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ dailySales }>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6200ee" />
              </BarChart>
            </ResponsiveContainer>
          </View>
        </ScrollView>

        <Divider style={ { marginVertical: 16 } } />

        {/* Top Products */ }
        <Text variant="titleMedium" style={ { marginBottom: 8 } }>
          Top Products
        </Text>
        { topProducts.length === 0 ? (
          <Text>No product sales yet.</Text>
        ) : (
          topProducts.map((p: any, idx: number) => (
            <Card key={ idx } style={ { marginBottom: 10 } }>
              <Card.Content>
                <Text variant="titleMedium">
                  { p.Product?.name || "Unknown Product" }
                </Text>
                <Text>Total Sold: { p.totalSold }</Text>
                <Text>Revenue: ${ Number(p.revenue).toFixed(2) }</Text>
              </Card.Content>
            </Card>
          ))
        ) }
      </View>
    </ScrollView>
  );
}
