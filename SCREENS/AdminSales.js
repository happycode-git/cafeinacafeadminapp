import { useEffect, useState } from "react";
import {
  Grid,
  IconButtonOne,
  IconButtonTwo,
  RoundedCorners,
  SafeArea,
  backgrounds,
  bus,
  colors,
  firebase_GetAllDocumentsListener,
  format,
  layout,
  sizes,
} from "../EVERYTHING/BAGEL/Things";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AdminMenuBar } from "../EVERYTHING/AdminMenuBar";

export function AdminSales({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [showTotals, setShowTotals] = useState(false);
  const [orderSales, setOrderSales] = useState([]);
  const [chosenDate, setChosenDate] = useState("");

  const groupOrdersByDate = (orders) => {
    const groupedOrders = {};
    orders.forEach((order) => {
      const date = new Date(order.Date.seconds * 1000).toDateString();

      if (!groupedOrders[date]) {
        groupedOrders[date] = { Date: order.Date, date, orders: [] };
      }

      groupedOrders[date].orders.push(order);
    });

    return Object.values(groupedOrders);
  };
  function getSalesData(orders) {
    const newOrders = [];
    for (var i = 0; i < orders.length; i += 1) {
      const order = orders[i];
      const tempArr = orderItems.filter((o) => o.OrderID === order.id);
      const tempOrder = { ...order, Items: tempArr };
      newOrders.push(tempOrder);
    }
    console.log(newOrders);
    setOrderSales(newOrders);
    setShowTotals(true);
  }

  useEffect(() => {
    setLoading(true);
    firebase_GetAllDocumentsListener(
      setLoading,
      "Orders",
      setOrders,
      0,
      "desc",
      "Date",
      "",
      "",
      ""
    );
    setLoading(true);
    firebase_GetAllDocumentsListener(
      setLoading,
      "OrderItems",
      setOrderItems,
      1000,
      "desc",
      "Name",
      "",
      "",
      ""
    );
  }, []);

  return (
    <SafeArea
      loading={loading}
      statusBar={"light"}
      styles={[{ backgroundColor: "#0B1721" }]}
    >
      <View style={[{ flex: 1 }]}>
        <View style={[layout.padding, layout.separate_horizontal]}>
          <Text style={[sizes.medium_text, colors.white]}>Sales</Text>
          <IconButtonTwo
            name={"menu-outline"}
            size={35}
            color={"white"}
            onPress={() => {
              setShowModal(true);
            }}
          />
        </View>
        <RoundedCorners
          topLeft={15}
          topRight={15}
          styles={[layout.padding, backgrounds.white]}
        >
          <Text style={[layout.padding_vertical_small]}>
            Tap on any date to view the sales data for that day.
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {groupOrdersByDate(orders).map((group, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  layout.padding,
                  {
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.2)",
                    marginVertical: 1,
                  },
                  format.radius,
                ]}
                onPress={() => {
                  setChosenDate(group.date);
                  getSalesData(group.orders);
                }}
              >
                <Text style={[format.bold, { fontSize: 16 }]}>
                  {group.date}
                </Text>
                <Text style={[{ fontSize: 12 }]}>
                  {group.orders.length} orders
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </RoundedCorners>
        <Modal visible={showTotals} animationType="slide">
          <SafeArea statusBar={"light"}>
            <View style={[{ flex: 1 }, layout.padding]}>
              <View style={[layout.separate_horizontal]}>
                <Text style={[{ fontSize: 14 }, format.bold]}>
                  Daily Total Sales: {chosenDate}
                </Text>
                <IconButtonTwo
                  name="close-outline"
                  size={30}
                  padding={6}
                  onPress={() => {
                    setShowTotals(false);
                  }}
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
              <Grid columns={4}>
                {orderSales.map((order, i) => {
                  return (
                    <View key={i} style={[{padding: 5}]}>
                      <Text style={[sizes.xsmall_text]}>
                        Order# {order.id.slice(-8)}
                      </Text>
                      <View
                        style={[
                          {
                            borderBottomColor: "rgba(0,0,0,0.1)",
                            borderBottomWidth: 1,
                          },
                        ]}
                      ></View>
                      <View>
                        {order.Items.map((item, j) => {
                          return (
                            <View key={j}>
                              <View style={[layout.separate_horizontal]}>
                                <Text style={[sizes.xsmall_text]}>
                                  {item.Name}
                                </Text>
                                <Text style={[sizes.xsmall_text]}>
                                  {item.Quantity}x
                                </Text>
                                <Text style={[sizes.xsmall_text]}>
                                  ${item.Total.toFixed(2)}
                                </Text>
                              </View>
                              <Text style={[{fontSize: 10, color: "rgba(0,0,0,0.7)"}]}>{item.Options.replaceAll("jjj","\n")}</Text>
                              {item.AmountRefunded > 0 && <Text style={[{color: "red"}, sizes.xsmall_text, format.right_text]}>Refunded: -${item.AmountRefunded}</Text>}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </Grid>
              </ScrollView>
              <View style={[layout.horizontal,{marginLeft: "auto"}]}>
              <Text style={[format.bold, format.right_text]}>{`Net Total: $${orderSales.reduce((total, order) => total + (order.Items || []).reduce((itemTotal, item) => itemTotal + (item.Total || 0), 0), 0).toFixed(2)}`}</Text>
              <Text style={[format.bold, format.right_text]}>{`Taxes: $${((orderSales.reduce((total, order) => total + (order.Items || []).reduce((itemTotal, item) => itemTotal + (item.Total || 0), 0), 0)) * 0.0875).toFixed(2)}`}</Text>
              <Text style={[format.bold, format.right_text]}>{`Gross Total: $${(orderSales.reduce((total, order) => total + (order.Items || []).reduce((itemTotal, item) => itemTotal + (item.Total || 0), 0), 0) + ((orderSales.reduce((total, order) => total + (order.Items || []).reduce((itemTotal, item) => itemTotal + (item.Total || 0), 0), 0)) * 0.0875)).toFixed(2)}`}</Text>
              </View>

            </View>
          </SafeArea>
        </Modal>
        {/* MENU BAR */}
        <Modal visible={showModal} animationType="slide">
          {/* INSERT ADMIN MENU HERE */}
          <AdminMenuBar
            bus={bus}
            navigation={navigation}
            route={route}
            setToggle={setShowModal}
          />
        </Modal>
      </View>
    </SafeArea>
  );
}
