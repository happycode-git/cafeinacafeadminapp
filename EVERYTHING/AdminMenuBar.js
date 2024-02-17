import { Alert, Image, ScrollView, Text, View } from "react-native";
import {
  AsyncImage,
  ButtonOne,
  Icon,
  IconButtonOne,
  LinkOne,
  SafeArea,
  Spacer,
  auth_SignOut,
  colors,
  format,
  layout,
  sizes,
} from "./BAGEL/Things";
import { useState } from "react";

export function AdminMenuBar({ navigation, route, bus, setToggle }) {
  const [loading, setLoading] = useState(false);
  const iconSize = 30
  const textSize = 20
  return (
    <SafeArea styles={[{ backgroundColor: "white" }]}>
      <View style={[layout.padding, { flex: 1 }]}>
        <View>
          <View style={[layout.center_horizontal, { width: 75, height: 75 }]}>
            <Image source={require("../assets/logo.png")} style={[{width: 75, height: 75}]} />
          </View>
          <Spacer height={5} />
          <Text style={[sizes.large_text, format.center_text, format.bold]}>
            {bus.Name}
          </Text>
        </View>
        <Spacer height={16} />
        <View style={[layout.separate_vertical]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[layout.padding_vertical, layout.vertical]}>
                {/* ORDERS */}
              <ButtonOne
                backgroundColor={"white"}
                padding={5}
                onPress={() => {
                  setToggle(false);
                  navigation.navigate("admin-orders", { bus });
                }}
              >
                <View style={[layout.horizontal, { alignItems: "center" }]}>
                  <Icon name={"document-text-outline"} size={iconSize} />
                  <Text style={[{fontSize: textSize}]}>Orders</Text>
                </View>
              </ButtonOne>
              {/* MENU */}
              <ButtonOne
                backgroundColor={"white"}
                padding={5}
                onPress={() => {
                  setToggle(false);
                  navigation.navigate("admin-menu", { bus });
                }}
              >
                <View style={[layout.horizontal, { alignItems: "center" }]}>
                  <Icon name={"cafe-outline"} size={iconSize} />
                  <Text style={[{fontSize: textSize}]}>Menu</Text>
                </View>
              </ButtonOne>
              {/* REWARDS */}
              <ButtonOne
                backgroundColor={"white"}
                padding={5}
                onPress={() => {
                  setToggle(false);
                  navigation.navigate("admin-rewards", { bus });
                }}
              >
                <View style={[layout.horizontal, { alignItems: "center" }]}>
                  <Icon name={"star-outline"} size={iconSize} />
                  <Text style={[{fontSize: textSize}]}>Rewards</Text>
                </View>
              </ButtonOne>
              {/* SALES */}
              <ButtonOne
                backgroundColor={"white"}
                padding={5}
                onPress={() => {
                  setToggle(false);
                  navigation.navigate("admin-sales", { bus });
                }}
              >
                <View style={[layout.horizontal, { alignItems: "center" }]}>
                  <Icon name={"cash-outline"} size={iconSize} />
                  <Text style={[{fontSize: textSize}]}>Sales</Text>
                </View>
              </ButtonOne>
               {/* SETTINGS */}
               <ButtonOne
                backgroundColor={"white"}
                padding={5}
                onPress={() => {
                  setToggle(false);
                  navigation.navigate("admin-settings", { bus });
                }}
              >
                <View style={[layout.horizontal, { alignItems: "center" }]}>
                  <Icon name={"settings-outline"} size={iconSize} />
                  <Text style={[{fontSize: textSize}]}>Settings</Text>
                </View>
              </ButtonOne>
            </View>
          </ScrollView>
          {/*  */}
          <View style={[layout.separate_horizontal]}>
          <LinkOne
            underlineColor={"rgba(0,0,0,0)"}
            onPress={() => {
              Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                { text: "Cancel" },
                {
                  text: "Sign Out",
                  style: "destructive",
                  onPress: () => {
                    auth_SignOut(
                      setLoading,
                      navigation,
                      { bus },
                      "login-admin"
                    );
                  },
                },
              ]);
            }}
          >
            <View style={[layout.horizontal, { alignItems: "center" }]}>
              <Icon name="return-up-back-outline" color={"red"} size={30} />
              <Text style={[{ color: "red", fontSize: 20 }]}>Sign Out</Text>
            </View>
          </LinkOne>
          <ButtonOne
          padding={4}
          radius={100}
          backgroundColor={"rgba(0,0,0,0.1)"}
          styles={[{ paddingVertical: 4, paddingHorizontal: 18 }]}
          onPress={() => {
            setToggle(false);
          }}
        >
          <View style={[layout.separate_horizontal, layout.center_horizontal]}>
            <Icon color={"black"} name="close-outline" size={28} />
            <Text style={[colors.black]}>Close</Text>
          </View>
        </ButtonOne>
          </View>
        </View>
      </View>
     
    </SafeArea>
  );
}
