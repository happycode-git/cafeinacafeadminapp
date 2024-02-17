import { Alert, Text, View } from "react-native";
import {
  ButtonOne,
  Grid,
  Spacer,
  firebase_GetAllDocumentsListener,
  format,
  layout,
  sizes,
} from "../EVERYTHING/BAGEL/Things";
import { useEffect, useState } from "react";

export function Lock({ navigation, route, setLock, setShowLock, setShowModal }) {
  const [code, setCode] = useState([]);
  const [actualCodes, setActualCodes] = useState([]);
  const [loading, setLoading] = useState(false)
  function onTypeCode(num) {
    const str = `${code}${num}`;
    console.log(actualCodes)
    if (str.length >= 4) {
        
      setCode("");
      if (actualCodes.some(obj => obj.Code === str)){
        setLock(false);
        setShowLock(false);
        setShowModal(true)
      } else {
        Alert.alert("Incorrect", "Please enter a correct code.");
      }
    } else {
      setCode(str);
    }
  }

  useEffect(() => {
    firebase_GetAllDocumentsListener(
      setLoading,
      "Codes",
      setActualCodes,
      0,
      "asc",
      "Code",
      "",
      "",
      ""
    );
  }, []);

  return (
    <View style={[layout.padding, {flex: 1}]}>
      <Text style={[sizes.xlarge_text, format.bold]}>Enter Code: {code}</Text>
      <Spacer height={15} />
      <Grid columns={3}>
        <ButtonOne
          onPress={() => {
            onTypeCode(1);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            1
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(2);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            2
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(3);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            3
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(4);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            4
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(5);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            5
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(6);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            6
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(7);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            7
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(2);
          }}
          styles={[{ margin: 8 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            8
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(9);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            9
          </Text>
        </ButtonOne>
        <ButtonOne
          onPress={() => {
            onTypeCode(0);
          }}
          styles={[{ margin: 5 }]}
        >
          <Text style={[{ fontSize: 50, color: "white" }, format.center_text]}>
            0
          </Text>
        </ButtonOne>
      </Grid>
    </View>
  );
}
