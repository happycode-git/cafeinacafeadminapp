import { useEffect, useState } from "react";
import {
  AsyncImage,
  ButtonOne,
  Icon,
  LinkOne,
  RoundedCorners,
  SafeArea,
  TextFieldOne,
  auth_IsUserSignedIn,
  auth_ResetPassword,
  auth_SignIn,
  colors,
  format,
  height,
  layout,
  sizes,
  width,
  bus,
  auth_SignOut
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";

export function AdminLogin({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onTypeEmail(text) {
    setEmail(text);
  }
  function onTypePass(text) {
    setPassword(text);
  }
  function onSignIn() {
    setLoading(true);
    auth_SignIn(setLoading, email, password, navigation, bus, "admin-orders");
  }

  useEffect(() => {
    setLoading(true);
    // auth_SignOut(setLoading, navigation, bus, "login-admin")
    auth_IsUserSignedIn(
      setLoading,
      navigation,
      "admin-orders",
      "login-admin",
      bus
    );
  }, []);

  return (
    <SafeArea
      loading={loading}
      styles={[{ backgroundColor: "#000000" }]}
      statusBar={"light"}
    >
     
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={[layout.padding, { flex: 1 }]}>
          <View style={[layout.padding]}>
            <Text style={[sizes.large_text, colors.white]}>Admin Login</Text>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <RoundedCorners
              topLeft={20}
              topRight={20}
              bottomLeft={20}
              bottomRight={20}
              styles={[
                {
                  backgroundColor: "white",
                  flex: 1,
                  maxWidth: 450,
                  minWidth: 325,
                  width: "100%",
                },
                layout.center_horizontal,
              ]}
            >
              <View style={[layout.padding, layout.separate_vertical]}>
                <View
                  style={[
                    layout.fit_width,
                    layout.center_horizontal,
                    { height: height * 0.2, width: height * 0.2 },
                  ]}
                >
                  <Image source={require("../assets/logo.png")} style={[{width: height * 0.2, height: height * 0.2}]} />
                </View>
                <View style={[{ gap: 4 }]}>
                  <TextFieldOne placeholder={"Email"} onTyping={onTypeEmail} />
                  <TextFieldOne
                    placeholder={"Password"}
                    isPassword={true}
                    onTyping={onTypePass}
                  />
                  <ButtonOne backgroundColor={"#1BA8FF"} onPress={onSignIn}>
                    <Text style={[colors.white, format.center_text]}>
                      Login
                    </Text>
                  </ButtonOne>
                </View>
              </View>
            </RoundedCorners>
          </ScrollView>

          <View style={[{ paddingVertical: 8 }, layout.center_horizontal]}>
            <LinkOne
              underlineColor={"white"}
              onPress={() => {
                auth_ResetPassword(email);
              }}
            >
              <Text style={[colors.white]}>Forgot your password?</Text>
            </LinkOne>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
