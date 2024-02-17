// #region IMPORTS
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Keyboard,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Linking,
  Animated,
  Easing,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import { Ionicons } from "react-native-vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import CheckBox from "expo-checkbox";
import * as Notifications from "expo-notifications";
import { Audio, Video, ResizeMode } from "expo-av";
import DateTimePicker from "@react-native-community/datetimepicker";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  limit,
  setDoc,
  where,
} from "firebase/firestore";
// #endregion

// CONSTANTS
export const { height, width } = Dimensions.get("window");
export function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
export const c_projectID = "92e20733-ff79-49a4-a997-92a07d219a9a";
export const c_googleMapsAPI = "AIzaSyBtE2qvx3l_A-a5ldpcFvQHu7qdT9CMVH4";
export const publishableKey =
  "pk_test_51NuJfZIDyFPNiK5CPKgovhg5fen3VM4SzxvBqdYAfwriYKzoqacsfIOiNAt5ErXss3eHYF45ak5PPFHeAD0AXit900imYxFTry";
export const serverAPIURL = "https://garnet-private-hisser.glitch.me";
export const appName = "IICCoffeeShopDemoy";
export const coords = { latitude: 32.74993, longitude: -117.0952 };
export var me = {};
export var myID = "test";
export var myToken = "";
export var bus = {
  Name: "Cafeina Cafe",
  Image: require("../../assets/logo.png"),
};

// COMPONENTS
export function SafeArea({ statusBar, loading, children, styles }) {
  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: Platform.OS === "ios" ? 50 : 35,
          paddingBottom: Platform.OS === "ios" ? 35 : 10,
        },
        styles,
      ]}
    >
      <StatusBar style={statusBar === "light" ? "light" : "dark"}></StatusBar>
      {loading && <Loading />}
      {children}
    </View>
  );
}
export function SplitView({ children, leftSize, rightSize, styles }) {
  const [left, right] = React.Children.toArray(children);
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "flex-start", gap: 10 },
        styles,
      ]}
    >
      <View style={[{ flex: leftSize }]}>{left}</View>
      <View style={[{ flex: rightSize }]}>{right}</View>
    </View>
  );
}
export function Grid({ columns, children, styles }) {
  const childrenArray = React.Children.toArray(children);
  const rows = Math.ceil(childrenArray.length / columns);

  return (
    <View style={[{ flexDirection: "column", flexWrap: "wrap" }, styles]}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {childrenArray
            .slice(rowIndex * columns, (rowIndex + 1) * columns)
            .map((child, colIndex) => (
              <View key={colIndex} style={[{ flex: 1 / columns }]}>
                {child}
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}
export function FadeWrapper({ children, seconds }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const milliseconds = seconds * 1000;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: milliseconds !== undefined ? milliseconds : 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[{ opacity: fadeAnim }]}>{children}</Animated.View>
  );
}
export function Spacer({ height }) {
  return <View style={[{ height: height !== undefined ? height : 15 }]}></View>;
}
export function Loading() {
  return (
    <View
      style={[
        {
          position: "absolute",
          height: height,
          width: width,
          backgroundColor: "rgba(0,0,0,0.75)",
          zIndex: 10000,
        },
      ]}
    >
      <View style={[{ flex: 1 }]}></View>
      <View style={[layout.center_horizontal, layout.padding]}>
        <Image
          source={require("../../assets/logo.png")}
          style={[{ width: 80, height: 80 }, format.radius]}
        />
      </View>
      <ActivityIndicator />
      <View style={[{ flex: 1 }]}></View>
    </View>
  );
}
export function RoundedCorners({
  children,
  topRight = 0,
  topLeft = 0,
  bottomRight = 0,
  bottomLeft = 0,
  styles,
}) {
  return (
    <View
      style={[
        styles,
        {
          borderTopRightRadius: topRight,
          borderTopLeftRadius: topLeft,
          borderBottomRightRadius: bottomRight,
          borderBottomLeftRadius: bottomLeft,
        },
      ]}
    >
      {children}
    </View>
  );
}
export function PulsingView({ children, speed = 1 }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 300 / speed, // Adjust duration based on speed
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300 / speed, // Adjust duration based on speed
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => pulseAnimation());
  };

  useEffect(() => {
    pulseAnimation();
  }, [speed]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      {children}
    </Animated.View>
  );
}
export function ButtonOne({
  children,
  backgroundColor,
  radius,
  padding,
  onPress,
  width,
  styles,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            backgroundColor:
              backgroundColor !== undefined ? backgroundColor : "black",
            borderRadius: radius !== undefined ? radius : 6,
            padding: padding !== undefined ? padding : 14,
            width: width !== undefined ? width : "auto",
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function ButtonTwo({
  children,
  borderWidth,
  borderColor,
  radius,
  padding,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            borderWidth: borderWidth !== undefined ? borderWidth : 1,
            borderColor: borderColor !== undefined ? borderColor : "black",
            borderRadius: radius !== undefined ? radius : 6,
            padding: padding !== undefined ? padding : 14,
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function IconButtonOne({
  name,
  size,
  padding,
  background,
  color,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity
      style={[
        {
          padding: padding !== undefined ? padding : 10,
          backgroundColor:
            background !== undefined ? background : "rgba(0,0,0,0.2)",
          borderRadius: 100,
          alignSelf: "flex-start",
        },
        styles,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={name}
        size={size}
        style={[{ color: color !== undefined ? color : "black" }]}
      />
    </TouchableOpacity>
  );
}
export function IconButtonTwo({ name, size, color, onPress, styles }) {
  return (
    <TouchableOpacity style={[styles]} onPress={onPress}>
      <Ionicons
        name={name}
        size={size}
        style={[
          {
            color: color !== undefined ? color : "black",
          },
        ]}
      />
    </TouchableOpacity>
  );
}
export function IconButtonThree({
  name,
  size,
  color,
  borderColor,
  radius,
  padding,
  onPress,
  styles,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles,
        {
          borderWidth: 1,
          borderColor: borderColor !== undefined ? borderColor : "black",
          padding: padding !== undefined ? padding : 12,
          borderRadius: radius !== undefined ? radius : 100,
          alignSelf: "flex-start",
        },
      ]}
    >
      <Ionicons
        name={name}
        size={size}
        style={{ color: color !== undefined ? color : "black" }}
      />
    </TouchableOpacity>
  );
}
export function Icon({ name, size, color, styles }) {
  return (
    <Ionicons
      name={name}
      size={size}
      style={[{ color: color !== undefined ? color : "black" }, styles]}
    />
  );
}
export function LinkOne({ children, underlineColor, onPress, styles }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor:
              underlineColor !== undefined ? underlineColor : "black",
            alignSelf: "flex-start",
          },
          styles,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}
export function TextFieldOne({
  placeholder,
  textSize,
  radius,
  onTyping,
  isPassword,
  autoCap,
  isNum,
  value,
  styles,
}) {
  function onType(text) {
    onTyping(text);
  }
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={"rgba(0,0,0,0.5)"}
      onChangeText={onType}
      value={value}
      secureTextEntry={isPassword}
      autoCapitalize={autoCap ? "sentences" : "none"}
      keyboardType={isNum ? "decimal-pad" : "default"}
      style={[
        {
          padding: 14,
          backgroundColor: "#dae0e3",
          fontSize: textSize !== undefined ? textSize : 16,
          borderRadius: radius !== undefined ? radius : 6,
        },
        styles,
      ]}
    />
  );
}
export function TextAreaOne({
  placeholder,
  textSize,
  radius,
  onTyping,
  value,
  styles,
}) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  function onType(text) {
    onTyping(text);
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners when component is unmounted
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View>
      <View
        style={[
          {
            backgroundColor: "#dae0e3",
            padding: 14,
            borderRadius: radius !== undefined ? radius : 6,
          },
        ]}
      >
        <TextInput
          multiline={true}
          placeholder={placeholder}
          placeholderTextColor={"rgba(0,0,0,0.5)"}
          onChangeText={onType}
          value={value}
          style={[
            {
              fontSize: textSize !== undefined ? textSize : 16,
            },
            styles,
          ]}
        />
      </View>
      {isKeyboardVisible && (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <Text
            style={[{ textAlign: "right", paddingVertical: 6, fontSize: 16 }]}
          >
            Done
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
export function DropdownOne({ options, radius, value, setter, styles }) {
  const [toggle, setToggle] = useState(false);
  return (
    <View style={styles}>
      <TouchableOpacity
        onPress={() => {
          setToggle(!toggle);
        }}
      >
        <View
          style={[
            {
              backgroundColor: "#dae0e3",
              padding: 14,
              borderRadius: radius !== undefined ? radius : 10,
            },
            layout.separate_horizontal,
            layout.relative,
          ]}
        >
          <Text style={[sizes.medium_text]}>{value}</Text>
          <Ionicons name="chevron-down-outline" size={25} />
        </View>
      </TouchableOpacity>
      {toggle && (
        <View>
          {options.map((option, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={[{ padding: 14 }]}
                onPress={() => {
                  setter(option);
                  setToggle(false);
                }}
              >
                <Text style={[sizes.medium_text]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
export function CheckboxOne({ value, setter, text, textSize }) {
  function onCheck() {
    setter(!value);
  }
  return (
    <View style={[layout.horizontal]}>
      <CheckBox value={value} onValueChange={onCheck} />
      <Text style={[{ fontSize: textSize !== undefined ? textSize : 14 }]}>
        {text}
      </Text>
    </View>
  );
}
export function SegmentedPicker({
  options,
  value,
  setter,
  backgroundColor,
  color,
  size,
}) {
  return (
    <View style={[layout.horizontal]}>
      {options.map((option, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={[
              {
                paddingVertical: 12,
                paddingHorizontal: 18,
                borderRadius: 50,
                backgroundColor:
                  value === option
                    ? backgroundColor !== undefined
                      ? backgroundColor
                      : "black"
                    : "rgba(0,0,0,0.2)",
              },
            ]}
            onPress={() => {
              setter(option);
            }}
          >
            <Text
              style={[
                {
                  color:
                    value === option
                      ? "white"
                      : color !== undefined
                      ? color
                      : "black",
                  fontSize: size !== undefined ? size : 14,
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export function CameraPicker({ setToggle, setLoading, setImage }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = React.useRef(null);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  async function takePicture() {
    if (cameraRef.current && isCameraReady && !capturing) {
      setCapturing(true);
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
        setLoading(false);
        setToggle(false);
      } finally {
        setCapturing(false);
        setLoading(false);
        setToggle(false);
      }
    }
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={[
          layout.absolute,
          layout.full_height,
          layout.full_width,
          { top: 0, bottom: 0, left: 0, right: 0 },
          backgrounds.white,
          layout.separate_vertical,
        ]}
      >
        <View></View>
        <View style={[layout.vertical]}>
          <Text style={{ textAlign: "center" }}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            onPress={() => {
              requestPermission();
              console.log("GRANTED");
              // setToggle(true);
            }}
          >
            <Text style={[format.center_text, sizes.medium_text, colors.blue]}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
        <View></View>
      </View>
    );
  }

  return (
    <View
      style={[
        backgrounds.black,
        layout.absolute,
        { top: 0, right: 0, left: 0, bottom: 0 },
        layout.full_height,
        layout.full_width,
        { paddingVertical: 55 },
      ]}
    >
      <Camera
        style={[{ height: "100%", width: "100%" }]}
        type={type}
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View
          style={[
            layout.separate_horizontal,
            layout.padding,
            layout.absolute,
            { top: 0, right: 0, left: 0, bottom: 0 },
            layout.full_width,
            layout.fit_height,
            layout.align_bottom,
          ]}
        >
          <View style={[layout.separate_horizontal]}>
            <TouchableOpacity
              style={[
                { paddingVertical: 8, paddingHorizontal: 14 },
                layout.margin,
                layout.fit_width,
                { backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 30 },
              ]}
              onPress={() => {
                setToggle(false);
              }}
            >
              <View>
                <Text style={[colors.white]}>Close</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 30,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                },
                layout.fit_height,
              ]}
              onPress={toggleCameraType}
            >
              <Text style={[colors.white]}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              {
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={takePicture}
          >
            <Ionicons name="camera-outline" size={25} style={[colors.black]} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
export function AsyncImage({ path, width, height, radius }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const storageRef = ref(storage, path);
    getDownloadURL(storageRef)
      .then((url) => {
        // Image has been successfully loaded
        setImageUrl(url);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error loading image:", error);
      })
      .finally(() => {
        // Update loading state when the operation is complete
        setLoading(false);
      });
  }, [path]);

  return (
    <View style={[layout.relative]}>
      {loading ? (
        <View
          style={[
            {
              width: width !== undefined ? width : 100,
              height: height !== undefined ? height : 100,
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: radius !== undefined ? radius : 10,
            },
            layout.separate_vertical,
          ]}
        >
          <View></View>
          <ActivityIndicator />
          <View></View>
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: width !== undefined ? width : 100,
            height: height !== undefined ? height : 100,
            borderRadius: radius !== undefined ? radius : 10,
          }}
          resizeMode="cover"
          onLoadStart={() => setImageLoaded(false)} // Set imageLoaded to false when loading starts
          onLoad={() => setImageLoaded(true)} // Set imageLoaded to true when the image has finished loading
        />
      )}
      {!imageLoaded && (
        <View
          style={[
            {
              width: width !== undefined ? width : 100,
              height: height !== undefined ? height : 100,
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: radius !== undefined ? radius : 10,
            },
            layout.separate_vertical,
            layout.absolute,
          ]}
        >
          <View></View>
          <ActivityIndicator />
          <View></View>
        </View>
      )}
    </View>
  );
}
export function Map({ coords, delta, height, radius, scrollEnabled = true }) {
  // Default location for the app's headquarters
  const defaultLocation = {
    latitude: 37.7749, // Default latitude
    longitude: -122.4194, // Default longitude
  };

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{
          width: "100%",
          height: height !== undefined ? height : 125,
          borderRadius: radius !== undefined ? radius : 10,
        }}
        region={{
          latitude:
            coords.latitude !== undefined
              ? coords.latitude
              : defaultLocation.latitude,
          longitude:
            coords.longitude !== undefined
              ? coords.longitude
              : defaultLocation.longitude,
          latitudeDelta: delta !== undefined ? delta : 0.005,
          longitudeDelta: delta !== undefined ? delta : 0.005,
        }}
        scrollEnabled={scrollEnabled}
      >
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
        >
          <Image
            source={require("../../assets/marker.png")}
            style={{ width: 40, height: 40 }}
          />
        </Marker>
      </MapView>
    </View>
  );
}
export function LocalNotification({
  icon,
  title,
  message,
  color,
  setToggle,
  seconds,
}) {
  useEffect(() => {
    console.log("NOTIFICATION START");
    setTimeout(() => {
      setToggle(false);
      console.log("NOTIFICATION ENDED");
    }, seconds * 1000);
  }, []);

  return (
    <TouchableOpacity
      style={[
        layout.absolute,
        { top: Platform.OS === "ios" ? 60 : 35, right: 0, left: 0 },
      ]}
      onPress={() => {
        setToggle(false);
      }}
    >
      <View
        style={[
          backgrounds.white,
          layout.padding,
          layout.margin,
          format.radius,
          layout.horizontal,
          {
            elevation: 5, // Android shadow
            shadowColor: "rgba(0,0,0,0.3)",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
        ]}
      >
        <Icon
          name={icon !== undefined ? icon : "close-outline"}
          size={35}
          color={color}
        />
        <View>
          <Text style={[format.bold, sizes.small_text]}>{title}</Text>
          <Text style={[sizes.small_text]}>{message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export function AudioPlayer({ audioName, audioPath }) {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const path = audioPath || require("../../assets/AUDIO/sample.mp3");
  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  async function playPauseSound() {
    if (sound) {
      if (isPlaying) {
        console.log("Pausing Sound");
        await sound.pauseAsync();
      } else {
        console.log("Resuming Sound");
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      console.log("Loading Sound");
      const { sound, status } = await Audio.Sound.createAsync(path, {
        shouldPlay: true,
      });

      setSound(sound);
      setIsPlaying(true);
      console.log("Playing Sound");

      // Update the duration of the audio
      setDuration(status.durationMillis);

      // Set up a periodic callback to update the position of the slider
      sound.setOnPlaybackStatusUpdate((status) => {
        setPosition(status.positionMillis);

        // Check if audio has finished playing
        if (status.didJustFinish) {
          // Reset position to the beginning
          sound.setPositionAsync(0);
          setPosition(0);
          setIsPlaying(false);
        }
      });
    }
  }
  async function stopSound() {
    if (sound) {
      console.log("Stopping Sound");
      await sound.stopAsync();
      // Reset position to the beginning
      sound.setPositionAsync(0);
      setPosition(0);
      setIsPlaying(false);
    }
  }
  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading Sound");
        sound.unloadAsync();
      }
    };
  }, [sound]);
  const onSliderValueChange = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  return (
    <View
      style={[
        layout.padding,
        backgrounds.shadow,
        backgrounds.white,
        format.radius,
      ]}
    >
      <View style={[layout.horizontal]}>
        <IconButtonTwo
          name={isPlaying ? "pause" : "play"}
          onPress={playPauseSound}
          size={30}
        />
        <IconButtonTwo name="stop" onPress={stopSound} size={30} />
        <Text style={[sizes.medium_text]}>{audioName}</Text>
      </View>
      <View style={[layout.horizontal]}>
        <Slider
          style={{ width: "75%", height: 10 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor="black"
        />
        <Text>{`${formatTime(position)} / ${formatTime(duration)}`}</Text>
      </View>
    </View>
  );
}
export function VideoPlayer({ videoPath, radius }) {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoad = async (loadStatus) => {
    setIsLoading(false);
    setStatus(loadStatus);
    setDuration(loadStatus.durationMillis);
  };

  const seekBackward = async () => {
    if (video.current) {
      const newPosition = Math.max(0, status.positionMillis - 10000); // Go back 10 seconds
      await video.current.setPositionAsync(newPosition);
    }
  };

  const seekForward = async () => {
    if (video.current) {
      const newPosition = Math.min(
        status.durationMillis,
        status.positionMillis + 10000
      ); // Go forward 10 seconds
      await video.current.setPositionAsync(newPosition);
    }
  };

  const onSliderValueChange = (value) => {
    if (video.current) {
      setPosition(value);
    }
  };

  const onSlidingComplete = async (value) => {
    if (video.current) {
      await video.current.setPositionAsync(value);
    }
  };

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  useEffect(() => {
    console.log("Video Path:", videoPath);

    const loadVideo = async () => {
      try {
        if (typeof videoPath === "string") {
          // If videoPath is a string, assume it's a URI
          await video.current.loadAsync({ uri: videoPath }, {}, false);
        } else {
          // If videoPath is not a string, assume it's a local require statement
          await video.current.loadAsync(videoPath, {}, false);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    loadVideo();
  }, [videoPath]);

  return (
    <View>
      <Video
        style={{
          height: "auto",
          aspectRatio: 16 / 9,
          borderRadius: radius !== undefined ? radius : 10,
        }}
        ref={video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(newStatus) => {
          setStatus(newStatus);
          setPosition(newStatus.positionMillis);
        }}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
      />
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 10,
          }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </View>
  );
}
export function DateTime({ date, time, setDate, setTime }) {
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  return (
    <View
      style={[
        layout.horizontal,
        { backgroundColor: "rgba(0,0,0,0.4)" },
        format.radius,
        layout.padding_small,
        { width: "100%" },
      ]}
    >
      <DateTimePicker
        testID="datePicker"
        value={date}
        mode="date"
        is24Hour={true}
        display="calendar"
        onChange={onDateChange}
      />
      <DateTimePicker
        testID="timePicker"
        value={time}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={onTimeChange}
      />
    </View>
  );
}

// FUNCTIONS
export async function function_PickImage(setLoading, setImage) {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    setLoading(false);
    setImage(result.assets[0].uri);
  }
}
export async function function_GetLocation(setLoading, setLocation) {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied."
      );
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation);
    setLoading(false);
    console.log(status);
    console.log(userLocation.coords);
  } catch (error) {
    console.error("Error getting location:", error);
    setLoading(false);
  }
}
export async function function_NotificationsSetup() {
  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;

  if (finalStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Permission Required",
      "Push notifications need the appropriate permissions."
    );
    return;
  }

  const pushTokenData = await Notifications.getDevicePushTokenAsync({
    projectId: c_projectID,
  });
  console.log(pushTokenData);
  firebase_UpdateToken(pushTokenData.data);
  myToken = pushTokenData.data;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}
export function sendPushNotification(token, title, body) {
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      title: title,
      body: body,
    }),
  });
}
export function function_GetDirections(lat, lon) {
  const destination = `${lat},${lon}`;
  console.log(destination);
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  Linking.openURL(url).catch((err) =>
    console.error("Error opening Google Maps:", err)
  );
}
export async function function_AddressToLatLon(address, setter) {
  const apiKey = c_googleMapsAPI; // Replace with your own API key
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const { lat, lng } = location;
      setter({ latitude: lat, longitude: lng });
    } else {
      throw new Error("No results found for the given address.");
    }
  } catch (error) {
    console.error("Error geocoding address:", error.message);
    throw error;
  }
}

// STYLES
export const format = StyleSheet.create({
  center_text: {
    textAlign: "center",
  },
  right_text: {
    textAlign: "right",
  },
  left_text: {
    textAlign: "left",
  },
  bold: {
    fontWeight: "bold",
  },
  radius: {
    borderRadius: 10,
  },
  radius_full: {
    borderRadius: 100,
  },
  all_caps: {
    textTransform: "uppercase",
  },
});
export const sizes = StyleSheet.create({
  xsmall_text: {
    fontSize: 12,
  },
  small_text: {
    fontSize: 16,
  },
  medium_text: {
    fontSize: 20,
  },
  large_text: {
    fontSize: 25,
  },
  xlarge_text: {
    fontSize: 30,
  },
  xxlarge_text: {
    fontSize: 35,
  },
});
export const colors = StyleSheet.create({
  white: {
    color: "white",
  },
  black: {
    color: "black",
  },
  blue: {
    color: "#169FFF",
  },
});
export const layout = StyleSheet.create({
  padding: {
    padding: 14,
  },
  padding_small: {
    padding: 6,
  },
  padding_vertical: {
    paddingVertical: 14,
  },
  padding_vertical_small: {
    paddingVertical: 6,
  },
  padding_horizontal: {
    paddingHorizontal: 14,
  },
  padding_horizontal_small: {
    paddingHorizontal: 6,
  },
  margin: {
    margin: 14,
  },
  margin_small: {
    margin: 6,
  },
  margin_vertical: {
    marginVertical: 14,
  },
  margin_vertical_small: {
    marginVertical: 6,
  },
  margin_horizontal: {
    marginHorizontal: 14,
  },
  margin_horizontal_small: {
    marginHorizontal: 6,
  },
  horizontal: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  vertical: {
    flexDirection: "column",
    gap: 14,
  },
  separate_horizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separate_vertical: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
    zIndex: 1000,
  },
  bottom: {
    bottom: 0,
  },
  full_height: {
    flex: 1,
  },
  full_width: {
    flex: 1,
    flexDirection: "row",
  },
  fit_height: {
    alignItems: "flex-start",
  },
  fit_width: {
    alignSelf: "flex-start",
  },
  center_horizontal: {
    alignSelf: "center",
  },
  align_bottom: {
    alignItems: "flex-end",
  },
  align_top: {
    alignItems: "flex-start",
  },
  image_cover: {
    objectFit: "cover",
  },
  image_contain: {
    objectFit: "contain",
  },
  image_fill: {
    objectFit: "fill",
  },
});
export const backgrounds = StyleSheet.create({
  black: {
    backgroundColor: "black",
  },
  white: {
    backgroundColor: "white",
  },
  shadow: {
    elevation: 4, // Android shadow
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

// AUTH
// Config
const firebaseConfig = {
  apiKey: "AIzaSyBhMIp7U6l-nrbT5ySebfBko8vBMzVEMjo",
  authDomain: "cafeina-cafe-app.firebaseapp.com",
  projectId: "cafeina-cafe-app",
  storageBucket: "cafeina-cafe-app.appspot.com",
  messagingSenderId: "931444482872",
  appId: "1:931444482872:web:a445262fbfba929142d7cd",
  measurementId: "G-RNR9GZQPKQ"
};
// Initializations
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage();
const db = getFirestore(app);

export function auth_IsUserSignedIn(
  setLoading,
  navigation,
  ifLoggedIn,
  ifNotLoggedIn,
  params
) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_GetMe(uid);
      setLoading(false);
      if (params !== null) {
        navigation.navigate(ifLoggedIn, params);
      } else {
        navigation.navigate(ifLoggedIn);
      }
    } else {
      setLoading(false);
      console.log("USER IS NOT LOGGED IN");
      if (params !== null) {
        navigation.navigate(ifNotLoggedIn, params);
      } else {
        navigation.navigate(ifNotLoggedIn);
      }
    }
  });
}
export function auth_SignIn(
  setLoading,
  email,
  password,
  navigation,
  params,
  redirect
) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userID = user.uid;
      myID = userID;
      firebase_UpdateToken(myToken);
      firebase_GetMe(userID);
      console.log(userID);
      setLoading(false);
      if (params !== null) {
        navigation.navigate(redirect, params);
      } else {
        navigation.navigate(redirect);
      }
      // ...
    })
    .catch((error) => {
      const errorMessage = error.message;
      setLoading(false);
      Alert.alert("Invalid Login", errorMessage);
    });
}
export function auth_SignOut(setLoading, navigation, params, redirect) {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      setLoading(false);
      console.log("USER SIGNED OUT");
      if (params !== null) {
        navigation.navigate(redirect, params);
      } else {
        navigation.navigate(redirect);
      }
    })
    .catch((error) => {
      // An error happened.
      setLoading(false);
      Alert.alert("Error", "There was an issue. Check your connection.");
    });
}
export function auth_CreateUser(
  setLoading,
  email,
  password,
  args,
  navigation,
  params,
  redirect
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      const uid = user.uid;
      myID = uid;
      firebase_UpdateToken(myToken);
      firebase_CreateUser(args, uid).then(() => {
        setLoading(false);
        if (params !== null) {
          navigation.navigate(redirect, params);
        } else {
          navigation.navigate(redirect);
        }
      });
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert("Try Again", errorMessage);
      setLoading(false);
      // ..
    });
}
export function auth_ResetPassword(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      // ..
      Alert.alert(
        "Email Sent",
        "Please check your email for a reset password link."
      );
    })
    .catch((error) => {
      const errorMessage = error.message;
      Alert.alert("Error", errorMessage);
      // ..
    });
}
export async function firebase_CreateUser(args, uid) {
  await setDoc(doc(db, "Users", uid), args);
}
export async function firebase_GetMe(uid) {
  const docRef = doc(db, "Users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const user = {
      id: docSnap.id,
      ...docSnap.data(),
    };
    me = user;
    console.log(me);
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}
export async function firebase_GetDocument(
  setLoading,
  table,
  documentID,
  setter
) {
  const docRef = doc(db, table, documentID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const thing = {
      id: docSnap.id,
      ...docSnap.data(),
    };
    setter(thing);
    setLoading(false);
    return thing;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    setLoading(false);
  }
}
export async function firebase_GetAllDocuments(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereField,
  whereCondition,
  whereValue
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);
  let queryRef = collectionRef;

  if (docLimit > 0) {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        orderBy(orderField, order),
        limit(docLimit)
      );
    } else {
      queryRef = query(queryRef, orderBy(orderField, order), limit(docLimit));
    }
  } else {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        orderBy(orderField, order)
      );
    } else {
      queryRef = query(queryRef, orderBy(orderField, order));
    }
  }

  const querySnapshot = await getDocs(queryRef);
  const things = [];

  querySnapshot.forEach((doc) => {
    const thing = {
      id: doc.id,
      ...doc.data(),
    };
    things.push(thing);
  });
  console.log(things);
  setter(things);
  setLoading(false);
}
export function firebase_GetAllDocumentsListener(
  setLoading,
  table,
  setter,
  docLimit,
  order,
  orderField,
  whereField,
  whereCondition,
  whereValue
) {
  console.log("GETTING DOCS");
  const collectionRef = collection(db, table);
  let queryRef = collectionRef;

  if (docLimit > 0) {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        orderBy(orderField, order),
        limit(docLimit)
      );
    } else {
      queryRef = query(queryRef, orderBy(orderField, order), limit(docLimit));
    }
  } else {
    if (whereField !== "" && whereField !== null && whereField !== undefined) {
      queryRef = query(
        queryRef,
        where(whereField, whereCondition, whereValue),
        orderBy(orderField, order)
      );
    } else {
      queryRef = query(queryRef, orderBy(orderField, order));
    }
  }

  const _ = onSnapshot(queryRef, (querySnapshot) => {
    const things = [];
    querySnapshot.forEach((doc) => {
      const thing = {
        id: doc.id,
        ...doc.data(),
      };
      things.push(thing);
    });
    setter(things);
    setLoading(false);
  });
}
export async function firebase_CreateDocument(args, table, documentID) {
  await setDoc(doc(db, table, documentID), args);
}
export async function firebase_UpdateDocument(
  setLoading,
  table,
  documentID,
  args
) {
  const washingtonRef = doc(db, table, documentID);
  await updateDoc(washingtonRef, args);
  setLoading(false);
}
export async function firebase_DeleteDocument(setLoading, table, documentID) {
  await deleteDoc(doc(db, table, documentID));
  setLoading(false);
}
export async function firebase_UpdateToken(token) {
  const washingtonRef = doc(db, "Users", myID);

  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    Token: token,
  });
}
export async function storage_UploadImage(setLoading, image, path) {
  return new Promise(async (resolve, reject) => {
    setLoading(true);
    try {
      // Convert the data URL to a Blob
      const imageBlob = await fetch(image).then((res) => res.blob());

      // Upload the Blob to Firebase Storage
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, imageBlob);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress changes, if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle errors
          console.error("Error uploading image:", error);
          setLoading(false); // Update loading state in case of an error
          reject(error);
        },
        async () => {
          // Handle successful completion
          setLoading(false); // Update loading state
          resolve(); // Resolve the promise to indicate completion
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false); // Update loading state in case of an error
      reject(error);
    }
  });
}
export async function storage_GetImage(setLoading, path, setter) {
  const storageRef = ref(storage, path);
  getDownloadURL(storageRef)
    .then((url) => {
      // Image has been successfully loaded
      setter(url);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error loading image:", error);
    })
    .finally(() => {
      // Update loading state when the operation is complete
      setLoading(false);
    });
}
