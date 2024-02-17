import { useEffect, useState } from "react";
import {
  ButtonOne,
  IconButtonTwo,
  RoundedCorners,
  SafeArea,
  Spacer,
  TextFieldOne,
  bus,
  colors,
  firebase_GetAllDocumentsListener,
  firebase_GetDocument,
  firebase_GetMe,
  firebase_UpdateDocument,
  format,
  layout,
  me,
  sizes,
} from "../EVERYTHING/BAGEL/Things";
import { Alert, Modal, ScrollView, Text, View } from "react-native";
import { AdminMenuBar } from "../EVERYTHING/AdminMenuBar";

export function AdminSettings({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState({});
  //
  const [pointsPer, setPointsPer] = useState("");
  function onTypePointsPer(text) {
    setPointsPer(text);
  }

  const [headline, setHeadline] = useState("");
  function onTypeHeadline(text) {
    setHeadline(text);
  }

  const [cap, setCap] = useState("");
  function onTypeCap(text) {
    setCap(text);
  }

  const [taxes, setTaxes] = useState("");
  function onTypeTaxes(text) {
    setTaxes(text);
  }

  useEffect(() => {
    setLoading(true);
    firebase_GetDocument(setLoading, "Settings", "settings", setSettings).then(
      () => {
        if (settings.id !== undefined) {
          setHeadline(settings.Headline);
          setPointsPer(`${settings.PointsPer}`);
          setCap(`${settings.PointsCap}`);
          setTaxes(`${settings.Taxes}`);
          setLoading(false);
        }
      }
    );
  }, [settings.id]);

  return (
    <SafeArea
      loading={loading}
      statusBar={"light"}
      styles={[{ backgroundColor: "#0B1721" }]}
    >
      <View style={[{ flex: 1 }]}>
        <View style={[layout.padding, layout.separate_horizontal]}>
          <Text style={[sizes.medium_text, colors.white]}>Settings</Text>
          <IconButtonTwo
            name={"menu-outline"}
            size={35}
            color={"white"}
            onPress={() => {
              setShowModal(true);
            }}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RoundedCorners
            topLeft={15}
            topRight={15}
            styles={[{ backgroundColor: "#F2F3F7" }]}
          >
            <View style={[layout.padding]}>
              <Text style={[sizes.medium_text]}>Points Per Dollar</Text>
              <Text style={[sizes.xsmall_text]}>
                Enter a number value for the amount of points you want customers
                to receive on each dollar they spend.
              </Text>
              <Spacer height={7} />
              <View style={[layout.horizontal, { alignItems: "center" }]}>
                <Text style={[{ fontSize: 20 }]}>$</Text>
                <TextFieldOne
                  placeholder={"Points Per Dollar"}
                  onTyping={onTypePointsPer}
                  value={pointsPer}
                  isNum={true}
                />
              </View>
              <Spacer height={15} />
              <Text style={[sizes.medium_text]}>Menu Headline</Text>
              <Text style={[sizes.xsmall_text]}>
                Provide the headline text that will be displayed at the top of
                the focused items above the menu.
              </Text>
              <Spacer height={7} />
              <TextFieldOne
                placeholder={"Type headline..."}
                onTyping={onTypeHeadline}
                styles={[{ maxWidth: 300 }]}
                value={headline}
              />
              <Spacer height={15} />
              <Text style={[sizes.medium_text]}>Max Points</Text>
              <Text style={[sizes.xsmall_text]}>
                This number represents the maximum number of points a user can
                have in their account. Setting this number to 0 will allow
                infinite points.
              </Text>
              <Spacer height={7} />
              <TextFieldOne
                placeholder={"Max Points..."}
                onTyping={onTypeCap}
                styles={[{ maxWidth: 300 }]}
                value={`${cap}`}
                isNum={true}
              />
              <Spacer height={15} />
              <Text style={[sizes.medium_text]}>Taxes</Text>
              <Text style={[sizes.xsmall_text]}>
                Tax percent in decimal format.
              </Text>
              <Spacer height={7} />
              <TextFieldOne
                placeholder={"Taxes.. (ex. 0.0875)"}
                onTyping={onTypeTaxes}
                styles={[{ maxWidth: 300 }]}
                value={`${taxes}`}
                isNum={true}
              />
              <Spacer height={25} />
              <ButtonOne
                radius={10}
                backgroundColor={"#117DFA"}
                onPress={() => {
                  setLoading(true);
                  firebase_UpdateDocument(setLoading, "Settings", "settings", {
                    Headline: headline,
                    PointsPer: parseFloat(pointsPer),
                    PointsCap: parseInt(cap),
                    Taxes: parseFloat(taxes),
                  }).then(() => {
                    firebase_GetDocument(
                      setLoading,
                      "Settings",
                      "settings",
                      setSettings
                    ).then(() => {
                      Alert.alert(
                        "Success",
                        "Your settings have been updated successfully."
                      );
                    });
                  });
                }}
              >
                <Text
                  style={[sizes.small_text, colors.white, format.center_text]}
                >
                  Save Changes
                </Text>
              </ButtonOne>
            </View>
          </RoundedCorners>
          <Spacer height={50} />
        </ScrollView>

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
