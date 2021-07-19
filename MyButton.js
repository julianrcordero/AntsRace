import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { create as apiCreate } from "apisauce";
import AntCard from "./AntCard";
const { height, width } = Dimensions.get("window");
import _ from "lodash";
import MyCarousel from "./MyCarousel";
import AuthContext from "./context";

import { useTransition, animated } from "@react-spring/native";
const AnimatedView = animated(View);
const ListItemHeight = 115;

export default function MyButton({ color, onPress, text }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderWidth: 0.5,
    flex: 1,
    justifyContent: "center",
    margin: 5,
    padding: 10,
  },
});
