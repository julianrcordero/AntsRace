import { StatusBar } from "expo-status-bar";
import React, { Component, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { create as apiCreate } from "apisauce";
import create from "zustand";
import AntCard from "./AntCard";
const { height, width } = Dimensions.get("window");

import { useTransition, animated } from "@react-spring/native";
const AnimatedView = animated(View);
const ListItemHeight = 190;

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Transition, Transitioning } from "react-native-reanimated";

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export default function App() {
  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const myURL = "https://sg-ants-server.herokuapp.com/graphql";
  const query = `
    query GetAnts {
      ants {
        name
        color
        length
        weight
      }
    }
  `;

  // const getItem = () => fetch(myURL + myEndpoint);
  const client = apiCreate({ baseURL: myURL });
  const getItem = () => client.get("", { query });

  const loadData = async () => {
    const response = await getItem();
    if (response.ok) {
      setData(response.data.data.ants);
      setRefreshing(false);
    } else {
      console.log(response);
    }
  };

  const transition = (
    <Transition.Together>
      <Transition.Change durationMs={250} />
    </Transition.Together>
  );

  // useEffect(() => {
  //   loadData();
  // }, []);

  const keyExtractor = (item, index) => String(index);

  const eventHandler = (likelihood, name) => {
    // transitioningView.current.animateNextTransition();

    let sortedData = [...data];
    let index = sortedData.findIndex((el) => el.name === name);
    sortedData[index] = { ...sortedData[index], likelihood: likelihood };
    // sortedData.sort((a, b) => b.likelihood - a.likelihood);
    // setData(sortedData);
  };

  const renderItem = ({ item }) => {
    return (
      <AntCard item={item} refreshing={refreshing} onChange={eventHandler} />
    );
  };

  const contentContainerStyle = { width: width * 0.85 };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const transitioningView = useRef();

  const edges = [...data];
  const transitions = useTransition(
    edges?.map((myData, i) => ({ ...myData, y: -(i * ListItemHeight) })),
    {
      key: (item) => item.id,
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y, height }) => ({ y, height, opacity: 1 }),
      // sort: (a, b) => b.likelihood - a.likelihood,
      update: ({ y, height }) => ({ y, height }),
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <TouchableOpacity
        style={{
          alignItems: "center",
          backgroundColor: "royalblue",
          justifyContent: "center",
          padding: 15,
        }}
        onPress={handleRefresh}
      >
        <Text>{"RELOAD ALL"}</Text>
      </TouchableOpacity>
      {/* <Transitioning.View ref={transitioningView} transition={transition}>
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={contentContainerStyle}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </Transitioning.View> */}
      <ScrollView
        contentContainerStyle={{ minHeight: edges.length * ListItemHeight }}
      >
        {transitions((style, item, _, index) => (
          <AnimatedView
            style={{
              zIndex: edges.length - index,
              bottom: style.y,
              height: style.height,
              opacity: style.opacity,
            }}
            key={item.id}
          >
            <AntCard
              item={item}
              refreshing={refreshing}
              onChange={eventHandler}
            />
          </AnimatedView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
  },
});
