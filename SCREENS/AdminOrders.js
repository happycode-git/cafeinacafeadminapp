import { useEffect, useState } from "react";
import {
  AsyncImage,
  ButtonOne,
  IconButtonOne,
  IconButtonTwo,
  LinkOne,
  LocalNotification,
  RoundedCorners,
  SafeArea,
  SegmentedPicker,
  Spacer,
  auth_SignOut,
  backgrounds,
  bus,
  colors,
  firebase_GetAllDocumentsListener,
  firebase_GetDocument,
  firebase_UpdateDocument,
  format,
  function_NotificationsSetup,
  layout,
  sendPushNotification,
  serverAPIURL,
  sizes,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AdminMenuBar } from "../EVERYTHING/AdminMenuBar";
import { Lock } from "./Lock";

export function AdminOrders({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("Preparing");
  const [chosenOrderID, setChosenOrderID] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showLocal, setShowLocal] = useState(false);
  const [user, setUser] = useState({});
  const [lock, setLock] = useState(true);
  const [showLock, setShowLock] = useState(false);
  //
  const taxes = 0.0875;

  async function processRefund(paymentIntentID, amount, orderItemID) {
    setLoading(true);
    const newTotal = parseFloat((amount + amount * taxes).toFixed(2));

    const paymentIntentId = paymentIntentID;
    Alert.alert(
      "Refund Requested",
      `Are you sure you want to process this refund if $${newTotal}?`,
      [
        { text: "Cancel" },
        {
          text: "Refund",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${serverAPIURL}/refund`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ paymentIntentId, total: newTotal }),
              });

              if (response.ok) {
                firebase_UpdateDocument(setLoading, "OrderItems", orderItemID, {
                  AmountRefunded: newTotal,
                });
                Alert.alert("Refund successful!");
              } else {
                Alert.alert("Refund failed. Please try again.");
              }
            } catch (error) {
              setLoading(false);
              console.error("Error refunding payment:", error);
            }

            // Perform any other actions after the refund here

            firebase_UpdateDocument(setLoading, "Orders", order.id, {
              Status: "Refunded",
            });
          },
        },
      ]
    );
  }

  useEffect(() => {
    // auth_SignOut(setLoading, navigation, route.params, "login-admin")
    setLock(true)
    function_NotificationsSetup();
    setLoading(true);
    firebase_GetAllDocumentsListener(
      setLoading,
      "Orders",
      setOrders,
      0,
      "asc",
      "Date",
      "",
      "",
      ""
    );
   console.log(lock)
  }, [lock]);

  return (
    <SafeArea
      loading={loading}
      statusBar={"light"}
      styles={[{ backgroundColor: "#0B1721" }]}
    >
      {showLocal && (
        <LocalNotification
          title={"Incoming order"}
          message={"A new order has been submitted."}
          icon={"cafe-outline"}
          color={"#117DFA"}
          setToggle={setShowLocal}
          seconds={4}
        />
      )}
      <View style={[{ flex: 1 }]}>
        <View style={[layout.padding, layout.separate_horizontal]}>
          <Text style={[sizes.medium_text, colors.white]}>Incoming Orders</Text>
          <IconButtonTwo
            name={"menu-outline"}
            size={35}
            color={"white"}
            onPress={() => {
              if (lock) {
                setShowLock(true);
              } else {
                setShowModal(true)
              }
            }}
          />
        </View>
        <RoundedCorners
          topLeft={15}
          topRight={15}
          styles={[{ backgroundColor: "#F2F3F7", flex: 1 }, layout.padding]}
        >
          <View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={[{ height: "auto" }]}
            >
              <SegmentedPicker
                options={["Preparing", "Ready", "Completed", "Refunded"]}
                setter={setStatus}
                value={status}
              />
            </ScrollView>
          </View>
          <Spacer height={20} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {status === "Preparing" && (
                <View style={[{ gap: 2 }]}>
                  {orders
                    .filter((o) => o.Status === "Preparing")
                    .map((order, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            layout.padding,
                            format.radius,
                            {
                              borderWidth: 1,
                              borderColor: "rgba(0,0,0,0.1)",
                              backgroundColor: order.Opened
                                ? "white"
                                : "#1BA8FF",
                            },
                          ]}
                          onPress={() => {
                            if (chosenOrderID !== order.id) {
                              // GET ITEMS
                              setLoading(true);
                              if (!order.Opened) {
                                firebase_UpdateDocument(
                                  setLoading,
                                  "Orders",
                                  order.id,
                                  { Opened: true }
                                );
                              }
                              firebase_GetAllDocumentsListener(
                                setLoading,
                                "OrderItems",
                                setOrderItems,
                                0,
                                "asc",
                                "Name",
                                "OrderID",
                                "==",
                                order.id
                              );
                              firebase_GetDocument(
                                setLoading,
                                "Users",
                                order.UserID,
                                setUser
                              );
                              setChosenOrderID(order.id);
                            } else {
                              setChosenOrderID("");
                            }
                          }}
                        >
                          <View
                            style={[
                              layout.separate_horizontal,
                              { alignItems: "center" },
                            ]}
                          >
                            <Text
                              style={[
                                format.all_caps,
                                sizes.medium_text,
                                format.bold,
                                { color: order.Opened ? "black" : "white" },
                              ]}
                            >
                              Order #{order.id.slice(-8)}
                            </Text>
                            <Text
                              style={[
                                sizes.medium_text,
                                { color: order.Opened ? "#117DFA" : "black" },
                              ]}
                            >
                              {order.Status}
                            </Text>
                          </View>
                          <Text
                            style={[
                              sizes.medium_text,
                              { color: order.Opened ? "black" : "white" },
                            ]}
                          >
                            {order.Name}
                          </Text>
                          <Text
                            style={[
                              { color: order.Opened ? "black" : "white" },
                            ]}
                          >
                            {new Date(
                              order.Date.seconds * 1000
                            ).toLocaleDateString() +
                              " " +
                              new Date(
                                order.Date.seconds * 1000
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </Text>

                          {/* SELECTED */}

                          <View>
                            {chosenOrderID === order.id && (
                              <View style={[layout.vertical]}>
                                <Spacer height={15} />
                                {orderItems.map((item, j) => {
                                  return (
                                    <View
                                      key={j}
                                      style={[
                                        layout.padding_vertical,
                                        {
                                          borderBottomColor: "rgba(0,0,0,0.2)",
                                          borderBottomWidth: 1,
                                        },
                                      ]}
                                    >
                                      <View style={[layout.horizontal]}>
                                        <View
                                          style={[{ width: 70, height: 70 }]}
                                        >
                                          <AsyncImage
                                            path={item.ImagePath}
                                            width={70}
                                            height={70}
                                          />
                                        </View>
                                        <View>
                                          <Text style={[sizes.medium_text]}>
                                            {item.Name}
                                          </Text>
                                          <Text style={[sizes.medium_text]}>
                                            {item.Quantity} x
                                          </Text>
                                        </View>
                                      </View>
                                      {/* DESCRIPTION */}
                                      {item.Options !== "" && (
                                        <View
                                          style={[
                                            {
                                              marginLeft: 10,
                                              paddingLeft: 15,
                                              borderLeftWidth: 2,
                                              borderLeftColor: "#28D782",
                                            },
                                            layout.margin_vertical,
                                          ]}
                                        >
                                          <Text style={[sizes.medium_text]}>
                                            {item.Options.replaceAll(
                                              "jjj",
                                              "\n"
                                            )}
                                          </Text>
                                        </View>
                                      )}
                                      {item.Details !== "" && (
                                        <View
                                          style={[
                                            {
                                              backgroundColor:
                                                "rgba(0,0,0,0.05)",
                                            },
                                            layout.padding,
                                            format.radius,
                                            layout.margin_vertical,
                                          ]}
                                        >
                                          <Text style={[sizes.medium_text]}>
                                            {item.Details.replaceAll(
                                              "jjj",
                                              "\n"
                                            )}
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                  );
                                })}
                                <View style={[layout.margin_vertical]}>
                                  <View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.small_text]}>
                                        Subtotal:
                                      </Text>
                                      <Text>
                                        $
                                        {orderItems
                                          .reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          )
                                          .toFixed(2)}
                                      </Text>
                                    </View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.small_text]}>
                                        Tax:
                                      </Text>
                                      <Text>
                                        $
                                        {(
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          ) * taxes
                                        ).toFixed(2)}
                                      </Text>
                                    </View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.medium_text]}>
                                        Total:
                                      </Text>
                                      <Text style={[sizes.medium_text]}>
                                        $
                                        {(
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          ) *
                                            taxes +
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          )
                                        ).toFixed(2)}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <View>
                                  <ButtonOne
                                    backgroundColor={"#117DFA"}
                                    radius={16}
                                    onPress={() => {
                                      setLoading(true);
                                      sendPushNotification(
                                        user.Token,
                                        "Order Ready",
                                        `Your order is now ready for pick up.`
                                      );
                                      setChosenOrderID("");
                                      firebase_UpdateDocument(
                                        setLoading,
                                        "Orders",
                                        order.id,
                                        { Status: "Ready" }
                                      );
                                    }}
                                  >
                                    <Text
                                      style={[
                                        colors.white,
                                        sizes.medium_text,
                                        format.center_text,
                                      ]}
                                    >
                                      Mark As Ready
                                    </Text>
                                  </ButtonOne>
                                </View>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
              {status === "Ready" && (
                <View>
                  {orders
                    .filter((o) => o.Status === "Ready")
                    .map((order, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            backgrounds.white,
                            layout.padding,
                            format.radius,
                            { borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" },
                          ]}
                          onPress={() => {
                            if (chosenOrderID !== order.id) {
                              // GET ITEMS
                              setLoading(true);
                              firebase_GetAllDocumentsListener(
                                setLoading,
                                "OrderItems",
                                setOrderItems,
                                0,
                                "asc",
                                "Name",
                                "OrderID",
                                "==",
                                order.id
                              );
                              firebase_GetDocument(
                                setLoading,
                                "Users",
                                order.UserID,
                                setUser
                              );
                              setChosenOrderID(order.id);
                            } else {
                              setChosenOrderID("");
                            }
                          }}
                        >
                          <View
                            style={[
                              layout.separate_horizontal,
                              { alignItems: "center" },
                            ]}
                          >
                            <Text
                              style={[
                                format.all_caps,
                                sizes.medium_text,
                                format.bold,
                              ]}
                            >
                              Order #{order.id.slice(-8)}
                            </Text>
                            <Text
                              style={[sizes.medium_text, { color: "#117DFA" }]}
                            >
                              {order.Status}
                            </Text>
                          </View>
                          <Text style={[sizes.medium_text]}>{order.Name}</Text>
                          <Text>
                            {new Date(
                              order.Date.seconds * 1000
                            ).toLocaleDateString() +
                              " " +
                              new Date(
                                order.Date.seconds * 1000
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </Text>

                          {/* SELECTED */}

                          <View>
                            {chosenOrderID === order.id && (
                              <View style={[layout.vertical]}>
                                <Spacer height={15} />
                                {orderItems.map((item, j) => {
                                  return (
                                    <View
                                      key={j}
                                      style={[
                                        layout.padding_vertical,
                                        {
                                          borderBottomColor: "rgba(0,0,0,0.2)",
                                          borderBottomWidth: 1,
                                        },
                                      ]}
                                    >
                                      <View style={[layout.horizontal]}>
                                        <View
                                          style={[{ width: 70, height: 70 }]}
                                        >
                                          <AsyncImage
                                            path={item.ImagePath}
                                            width={70}
                                            height={70}
                                          />
                                        </View>
                                        <View>
                                          <Text style={[sizes.medium_text]}>
                                            {item.Name}
                                          </Text>
                                          <Text style={[sizes.medium_text]}>
                                            {item.Quantity} x
                                          </Text>
                                        </View>
                                      </View>
                                      {/* DESCRIPTION */}
                                      {item.Options !== "" && (
                                        <View
                                          style={[
                                            {
                                              marginLeft: 10,
                                              paddingLeft: 15,
                                              borderLeftWidth: 2,
                                              borderLeftColor: "#28D782",
                                            },
                                            layout.margin_vertical,
                                          ]}
                                        >
                                          <Text style={[sizes.medium_text]}>
                                            {item.Options.replaceAll(
                                              "jjj",
                                              "\n"
                                            )}
                                          </Text>
                                        </View>
                                      )}
                                      {item.Details !== "" && (
                                        <View
                                          style={[
                                            {
                                              backgroundColor:
                                                "rgba(0,0,0,0.05)",
                                            },
                                            layout.padding,
                                            format.radius,
                                            layout.margin_vertical,
                                          ]}
                                        >
                                          <Text style={[sizes.medium_text]}>
                                            {item.Details.replaceAll(
                                              "jjj",
                                              "\n"
                                            )}
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                  );
                                })}
                                <View style={[layout.margin_vertical]}>
                                  <View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.small_text]}>
                                        Subtotal:
                                      </Text>
                                      <Text>
                                        $
                                        {orderItems
                                          .reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          )
                                          .toFixed(2)}
                                      </Text>
                                    </View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.small_text]}>
                                        Tax:
                                      </Text>
                                      <Text>
                                        $
                                        {(
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          ) * taxes
                                        ).toFixed(2)}
                                      </Text>
                                    </View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.medium_text]}>
                                        Total:
                                      </Text>
                                      <Text style={[sizes.medium_text]}>
                                        $
                                        {(
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          ) *
                                            taxes +
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          )
                                        ).toFixed(2)}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <View>
                                  <ButtonOne
                                    backgroundColor={"#28D782"}
                                    radius={16}
                                    onPress={() => {
                                      setLoading(true);
                                      sendPushNotification(
                                        user.Token,
                                        "Order Complete",
                                        `Thank you for your business!`
                                      );
                                      setChosenOrderID("");
                                      firebase_UpdateDocument(
                                        setLoading,
                                        "Orders",
                                        order.id,
                                        { Status: "Completed" }
                                      );
                                    }}
                                  >
                                    <Text
                                      style={[
                                        colors.white,
                                        sizes.medium_text,
                                        format.center_text,
                                      ]}
                                    >
                                      Mark As Complete
                                    </Text>
                                  </ButtonOne>
                                </View>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
              {status === "Completed" && (
                <View>
                  {orders
                    .filter((o) => o.Status === "Completed")
                    .map((order, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            backgrounds.white,
                            layout.padding,
                            format.radius,
                            { borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" },
                          ]}
                          onPress={() => {
                            if (chosenOrderID !== order.id) {
                              // GET ITEMS
                              setLoading(true);
                              firebase_GetAllDocumentsListener(
                                setLoading,
                                "OrderItems",
                                setOrderItems,
                                0,
                                "asc",
                                "Name",
                                "OrderID",
                                "==",
                                order.id
                              );
                              setChosenOrderID(order.id);
                            } else {
                              setChosenOrderID("");
                            }
                          }}
                        >
                          <View
                            style={[
                              layout.separate_horizontal,
                              { alignItems: "center" },
                            ]}
                          >
                            <Text
                              style={[
                                format.all_caps,
                                sizes.medium_text,
                                format.bold,
                              ]}
                            >
                              Order #{order.id.slice(-8)}
                            </Text>
                            <Text style={[sizes.medium_text, { color: "red" }]}>
                              {order.Status}
                            </Text>
                          </View>
                          <Text style={[sizes.medium_text]}>{order.Name}</Text>
                          <Text>
                            {new Date(
                              order.Date.seconds * 1000
                            ).toLocaleDateString() +
                              " " +
                              new Date(
                                order.Date.seconds * 1000
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </Text>

                          {/* SELECTED */}

                          <View>
                            {chosenOrderID === order.id && (
                              <View style={[layout.vertical]}>
                                <Spacer height={15} />
                                {orderItems.map((item, j) => {
                                  return (
                                    <View
                                      key={j}
                                      style={[
                                        layout.padding_vertical,
                                        {
                                          borderBottomColor: "rgba(0,0,0,0.2)",
                                          borderBottomWidth: 1,
                                        },
                                      ]}
                                    >
                                      <View style={[layout.horizontal]}>
                                        <View
                                          style={[{ width: 70, height: 70 }]}
                                        >
                                          <AsyncImage
                                            path={item.ImagePath}
                                            width={70}
                                            height={70}
                                          />
                                        </View>
                                        <View>
                                          <Text style={[sizes.medium_text]}>
                                            {item.Name}
                                          </Text>
                                          <Text style={[sizes.medium_text]}>
                                            {item.Quantity} x
                                          </Text>
                                          <View style={[layout.horizontal]}>
                                            <Text
                                              style={[
                                                {
                                                  textDecorationLine:
                                                    item.AmountRefunded > 0
                                                      ? "line-through"
                                                      : "none",
                                                },
                                              ]}
                                            >
                                              Item Total: $
                                              {item.Total.toFixed(2)} -
                                            </Text>
                                            <Text>
                                              $
                                              {(
                                                item.Total / item.Quantity
                                              ).toFixed(2)}{" "}
                                              ea
                                            </Text>
                                          </View>
                                          {item.AmountRefunded > 0 && (
                                            <Text style={[{ color: "red" }]}>
                                              - ${item.AmountRefunded} refunded
                                            </Text>
                                          )}
                                          {item.AmountRefunded < item.Total && (
                                            <LinkOne
                                              underlineColor={"red"}
                                              onPress={() => {
                                                processRefund(
                                                  order.PaymentIntent,
                                                  item.Total / item.Quantity,
                                                  item.id
                                                );
                                              }}
                                            >
                                              <Text
                                                style={[
                                                  { color: "red" },
                                                  format.right_text,
                                                ]}
                                              >
                                                Refund
                                              </Text>
                                            </LinkOne>
                                          )}
                                        </View>
                                      </View>
                                      {/* DESCRIPTION */}
                                      {item.Options !== "" && (
                                        <View
                                          style={[
                                            {
                                              marginLeft: 10,
                                              paddingLeft: 15,
                                              borderLeftWidth: 2,
                                              borderLeftColor: "#28D782",
                                            },
                                            layout.margin_vertical,
                                          ]}
                                        >
                                          <Text style={[sizes.medium_text]}>
                                            {item.Options.replaceAll(
                                              "jjj",
                                              "\n"
                                            )}
                                          </Text>
                                        </View>
                                      )}
                                      {item.Details !== "" && (
                                        <View
                                          style={[
                                            {
                                              backgroundColor:
                                                "rgba(0,0,0,0.05)",
                                            },
                                            layout.padding,
                                            format.radius,
                                            layout.margin_vertical,
                                          ]}
                                        >
                                          <Text style={[sizes.medium_text]}>
                                            {item.Details.replaceAll(
                                              "jjj",
                                              "\n"
                                            )}
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                  );
                                })}
                                <View style={[layout.margin_vertical]}>
                                  <View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.small_text]}>
                                        Subtotal:
                                      </Text>
                                      <Text>
                                        $
                                        {orderItems
                                          .reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          )
                                          .toFixed(2)}
                                      </Text>
                                    </View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.small_text]}>
                                        Tax:
                                      </Text>
                                      <Text>
                                        $
                                        {(
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          ) * taxes
                                        ).toFixed(2)}
                                      </Text>
                                    </View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.medium_text]}>
                                        Total:
                                      </Text>
                                      <Text style={[sizes.medium_text]}>
                                        $
                                        {(
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          ) *
                                            taxes +
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          )
                                        ).toFixed(2)}
                                      </Text>
                                    </View>
                                    {orderItems.some(
                                      (item) => item.AmountRefunded > 0
                                    ) && (
                                      <View
                                        style={[layout.separate_horizontal]}
                                      >
                                        <Text
                                          style={[
                                            sizes.small_text,
                                            { color: "orange" },
                                          ]}
                                        >
                                          New Total:
                                        </Text>
                                        <Text
                                          style={[
                                            sizes.small_text,
                                            { color: "orange" },
                                          ]}
                                        >
                                          $
                                          {(
                                            parseFloat(
                                              (
                                                orderItems.reduce(
                                                  (acc, item) =>
                                                    acc + item.Total,
                                                  0
                                                ) * taxes
                                              ).toFixed(2)
                                            ) +
                                            parseFloat(
                                              orderItems
                                                .reduce(
                                                  (acc, item) =>
                                                    acc + item.Total,
                                                  0
                                                )
                                                .toFixed(2)
                                            ) -
                                            parseFloat(
                                              orderItems
                                                .reduce(
                                                  (acc, item) =>
                                                    acc + item.AmountRefunded,
                                                  0
                                                )
                                                .toFixed(2)
                                            )
                                          ).toFixed(2)}
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                </View>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
              {status === "Refunded" && (
                <View>
                  {orders
                    .filter((o) => o.Status === "Refunded")
                    .map((order, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            backgrounds.white,
                            layout.padding,
                            format.radius,
                            { borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" },
                          ]}
                          onPress={() => {
                            if (chosenOrderID !== order.id) {
                              // GET ITEMS
                              setLoading(true);
                              firebase_GetAllDocumentsListener(
                                setLoading,
                                "OrderItems",
                                setOrderItems,
                                0,
                                "asc",
                                "Name",
                                "OrderID",
                                "==",
                                order.id
                              );
                              setChosenOrderID(order.id);
                            } else {
                              setChosenOrderID("");
                            }
                          }}
                        >
                          <View
                            style={[
                              layout.separate_horizontal,
                              { alignItems: "center" },
                            ]}
                          >
                            <Text
                              style={[
                                format.all_caps,
                                sizes.medium_text,
                                format.bold,
                              ]}
                            >
                              Order #{order.id.slice(-8)}
                            </Text>
                            <Text style={[sizes.medium_text, { color: "red" }]}>
                              {order.Status}
                            </Text>
                          </View>
                          <Text style={[sizes.medium_text]}>{order.Name}</Text>
                          <Text>
                            {new Date(
                              order.Date.seconds * 1000
                            ).toLocaleDateString() +
                              " " +
                              new Date(
                                order.Date.seconds * 1000
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </Text>

                          {/* SELECTED */}

                          <View>
                            {chosenOrderID === order.id && (
                              <View style={[layout.vertical]}>
                                <Spacer height={15} />
                                {orderItems.map((item, j) => {
                                  return (
                                    <View
                                      key={j}
                                      style={[
                                        layout.padding_vertical,
                                        {
                                          borderBottomColor: "rgba(0,0,0,0.2)",
                                          borderBottomWidth: 1,
                                        },
                                      ]}
                                    >
                                      <View style={[layout.horizontal]}>
                                        <View
                                          style={[{ width: 70, height: 70 }]}
                                        >
                                          <AsyncImage
                                            path={item.ImagePath}
                                            width={70}
                                            height={70}
                                          />
                                        </View>
                                        <View>
                                          <Text style={[sizes.medium_text]}>
                                            {item.Name}
                                          </Text>
                                          <Text style={[sizes.medium_text]}>
                                            {item.Quantity} x
                                          </Text>
                                          <View style={[layout.horizontal]}>
                                            <Text
                                              style={[
                                                {
                                                  textDecorationLine:
                                                    item.AmountRefunded > 0
                                                      ? "line-through"
                                                      : "none",
                                                },
                                              ]}
                                            >
                                              Item Total: $
                                              {item.Total.toFixed(2)} -
                                            </Text>
                                            <Text>
                                              $
                                              {(
                                                item.Total / item.Quantity
                                              ).toFixed(2)}{" "}
                                              ea
                                            </Text>
                                          </View>
                                          {item.AmountRefunded > 0 && (
                                            <Text style={[{ color: "red" }]}>
                                              - ${item.AmountRefunded} refunded
                                            </Text>
                                          )}
                                        </View>
                                      </View>
                                      {/* DESCRIPTION */}
                                      {item.Options !== "" && (
                                        <View
                                          style={[
                                            {
                                              marginLeft: 10,
                                              paddingLeft: 15,
                                              borderLeftWidth: 2,
                                              borderLeftColor: "#28D782",
                                            },
                                            layout.margin_vertical,
                                          ]}
                                        >
                                          <Text style={[sizes.medium_text]}>
                                            {item.Options.replaceAll(
                                              "jjj",
                                              "\n"
                                            )}
                                          </Text>
                                        </View>
                                      )}
                                      {item.Details !== "" && (
                                        <View
                                          style={[
                                            {
                                              backgroundColor:
                                                "rgba(0,0,0,0.05)",
                                            },
                                            layout.padding,
                                            format.radius,
                                            layout.margin_vertical,
                                          ]}
                                        >
                                          <Text style={[sizes.medium_text]}>
                                            {item.Details.replaceAll(
                                              "jjj",
                                              "\n"
                                            )}
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                  );
                                })}
                                <View style={[layout.margin_vertical]}>
                                  <View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.small_text]}>
                                        Subtotal:
                                      </Text>
                                      <Text>
                                        $
                                        {orderItems
                                          .reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          )
                                          .toFixed(2)}
                                      </Text>
                                    </View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.small_text]}>
                                        Tax:
                                      </Text>
                                      <Text>
                                        $
                                        {(
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          ) * taxes
                                        ).toFixed(2)}
                                      </Text>
                                    </View>
                                    <View style={[layout.separate_horizontal]}>
                                      <Text style={[sizes.medium_text]}>
                                        Total:
                                      </Text>
                                      <Text style={[sizes.medium_text]}>
                                        $
                                        {(
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          ) *
                                            taxes +
                                          orderItems.reduce(
                                            (acc, item) => acc + item.Total,
                                            0
                                          )
                                        ).toFixed(2)}
                                      </Text>
                                    </View>
                                    {orderItems.some(
                                      (item) => item.AmountRefunded > 0
                                    ) && (
                                      <View
                                        style={[layout.separate_horizontal]}
                                      >
                                        <Text
                                          style={[
                                            sizes.small_text,
                                            { color: "orange" },
                                          ]}
                                        >
                                          New Total:
                                        </Text>
                                        <Text
                                          style={[
                                            sizes.small_text,
                                            { color: "orange" },
                                          ]}
                                        >
                                          $
                                          {(
                                            parseFloat(
                                              (
                                                orderItems.reduce(
                                                  (acc, item) =>
                                                    acc + item.Total,
                                                  0
                                                ) * taxes
                                              ).toFixed(2)
                                            ) +
                                            parseFloat(
                                              orderItems
                                                .reduce(
                                                  (acc, item) =>
                                                    acc + item.Total,
                                                  0
                                                )
                                                .toFixed(2)
                                            ) -
                                            parseFloat(
                                              orderItems
                                                .reduce(
                                                  (acc, item) =>
                                                    acc + item.AmountRefunded,
                                                  0
                                                )
                                                .toFixed(2)
                                            )
                                          ).toFixed(2)}
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                </View>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
            </View>
          </ScrollView>
        </RoundedCorners>
        <Modal visible={showLock} animationType="slide">
          <ScrollView showsVerticalScrollIndicator={false}>
          <Spacer height={30} />
          <View style={[layout.separate_horizontal, layout.padding]}>
            <View></View>
            <View>
              <IconButtonOne
                name="close-outline"
                size={25}
                onPress={() => {
                  setShowLock(false);
                }}
              />
            </View>
          </View>
          <Lock
            navigation={navigation}
            route={route}
            setLock={setLock}
            setShowLock={setShowLock}
            setShowModal={setShowModal}
          />
          </ScrollView>
        </Modal>
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
