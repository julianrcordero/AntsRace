import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { create as apiCreate } from "apisauce";
import AntCard from "./AntCard";
const { height, width } = Dimensions.get("window");
import _ from "lodash";
import MyCarousel from "./MyCarousel";
import AuthContext from "./context";
import MyButton from "./MyButton";

import { useTransition, animated } from "@react-spring/native";
const AnimatedView = animated(View);
const ListItemHeight = 115;

export default function WelcomeScreen({ setUser }) {
  const [text, setText] = useState("");

  const logIn = () => {
    if (text.length > 0) {
      setUser(text);
    } else
      Alert.alert("Invalid username", "Please enter a valid username", [
        {
          text: "OK",
        },
      ]);
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode={"contain"}
        style={styles.image}
        source={require("./assets/ant-icon.png")}
      />
      <View>
        <Text style={styles.text}>{"Please enter a username:"}</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.textInput}
        />
        <View style={styles.login}>
          <MyButton color={"dodgerblue"} onPress={logIn} text={"LOG IN"} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "space-evenly",
    width: width * 0.75,
  },
  image: { height: 250 },
  login: { height: 50, marginVertical: 10 },
  text: { textAlign: "center", padding: 10 },
  textInput: {
    borderWidth: 0.2,
    padding: 10,
    width: width * 0.75,
  },
});
