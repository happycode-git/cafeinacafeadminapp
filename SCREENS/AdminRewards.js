import { useEffect, useState } from "react";
import {
  ButtonOne,
  DropdownOne,
  Icon,
  IconButtonTwo,
  RoundedCorners,
  SafeArea,
  Spacer,
  TextFieldOne,
  backgrounds,
  bus,
  colors,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocumentsListener,
  format,
  layout,
  randomString,
  sizes,
} from "../EVERYTHING/BAGEL/Things";
import { Alert, Modal, ScrollView, Text, View } from "react-native";
import { AdminMenuBar } from "../EVERYTHING/AdminMenuBar";

export function AdminRewards({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [items, setItems] = useState([]);
  //
  const [category, setCategory] = useState("Select One");
  const [points, setPoints] = useState("");
  function onTypePoints(text) {
    setPoints(text);
  }

  function onCreateReward() {
    if (category !== "" && category !== "Select One" && points !== "") {
      setLoading(true);
      const itemIDs = items
        .filter((item) => item.Category === category)
        .map((item) => item.id);
      const args = {
        Category: category,
        Points: parseFloat(points),
        ItemIDs: itemIDs,
      };
      firebase_CreateDocument(args, "Rewards", randomString(25)).then(() => {
        setCategory("Select One");
        setPoints("");
        setLoading(false);
      });
    } else {
      Alert.alert("Missing Info", "Please fill out all of the fields.");
    }
  }

  useEffect(() => {
    setCategory("Select One");
    setPoints("");
    setLoading(true);
    firebase_GetAllDocumentsListener(
      setLoading,
      "Rewards",
      setRewards,
      0,
      "asc",
      "Points",
      "",
      "",
      ""
    );
    setLoading(true);
    firebase_GetAllDocumentsListener(
      setLoading,
      "Items",
      setItems,
      0,
      "asc",
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
          <Text style={[sizes.medium_text, colors.white]}>Rewards</Text>
          <IconButtonTwo
            name={"menu-outline"}
            size={35}
            color={"white"}
            onPress={() => {
              setShowModal(true);
            }}
          />
        </View>

        <View>
          <RoundedCorners
            topLeft={15}
            topRight={15}
            styles={[{ backgroundColor: "#F2F3F7" }]}
          >
            <View style={[layout.padding]}>
              <View style={[backgrounds.white, layout.padding, format.radius]}>
                <View style={[layout.padding_vertical]}>
                  <Text style={[sizes.medium_text]}>Create New Reward</Text>
                  <Text>
                    Choose an item category that has not already been used.
                  </Text>
                </View>
                <View style={[layout.horizontal, { alignItems: "center" }]}>
                  <DropdownOne
                    options={[
                      ...new Set(items.map((item) => item.Category)),
                    ].filter(
                      (category) =>
                        !rewards.some((reward) => reward.Category === category)
                    )}
                    setter={setCategory}
                    value={category}
                    styles={[{ minWidth: 250 }]}
                  />
                  <TextFieldOne
                    placeholder={"# of Points"}
                    onTyping={onTypePoints}
                    isNum={true}
                    styles={[{ minWidth: 150 }]}
                  />
                  <ButtonOne radius={100} padding={18} onPress={onCreateReward}>
                    <Text style={[colors.white, format.center_text]}>
                      Create Reward
                    </Text>
                  </ButtonOne>
                </View>
              </View>
              <Spacer height={20} />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  <Text style={[sizes.medium_text]}>Active Rewards</Text>
                  <View style={[layout.vertical, layout.margin_vertical]}>
                    {rewards.length > 0 ? (
                      <View>
                        {rewards.map((reward, i) => {
                          return (
                            <View
                              key={i}
                              style={[
                                layout.horizontal,
                                { alignItems: "center" },
                              ]}
                            >
                              <Icon
                                name="star-outline"
                                size={25}
                                color="#1BA8FF"
                              />
                              <Text style={[sizes.medium_text, format.bold]}>
                                One free item from {reward.Category} for{" "}
                                {reward.Points} points.
                              </Text>
                              <IconButtonTwo name={"close-outline"} size={25} color={"red"} onPress={() => {
                                firebase_DeleteDocument(setLoading, "Rewards", reward.id)
                              }} />
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <View style={[layout.padding]}>
                        <Text style={[sizes.small_text]}>
                          No active rewards.
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </RoundedCorners>
        </View>

        {/* MENU */}
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
