import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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
import create from "zustand";
import AntCard from "./AntCard";
const { width } = Dimensions.get("window");
import _ from "lodash";

import { useTransition, animated } from "@react-spring/native";
const AnimatedView = animated(View);
const ListItemHeight = 125;

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

  const client = apiCreate({ baseURL: myURL });
  const getItem = () => client.get("", { query });

  const loadData = async () => {
    const response = await getItem();
    if (response.ok) {
      setData(response.data.data.ants);
    } else {
      console.log(response);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const keyExtractor = (item, index) => String(index);

  const eventHandler = (newLikelihood, name) => {
    // transitioningView.current.animateNextTransition();
    console.log("setting", name, "to", newLikelihood);
    let sortedData = [...data];
    let index = sortedData.findIndex((el) => el.name === name);
    sortedData[index] = { ...sortedData[index], likelihood: newLikelihood };
    setData(_.orderBy(sortedData, ["likelihood"], ["desc"]));
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

  const transitions = useTransition(
    data?.map((myData, i) => ({
      ...myData,
      y: -(i * ListItemHeight),
    })),
    {
      key: (item) => item.name,
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y, height }) => ({ y, height, opacity: 1 }),
      sort: (a, b) => {
        b.likelihood - a.likelihood;
      },
      update: ({ y, height }) => ({ y, height }),

      config: { mass: 5, tension: 500, friction: 150 },
    }
  );

  const shuffle = () => setData(_.shuffle(data));

  const handleSort = () => setData(_.sortBy(data, ["likelihood"]));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            backgroundColor: "royalblue",
            justifyContent: "center",
            padding: 10,
          }}
          onPress={handleRefresh}
        >
          <Text>{"Run odds"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            backgroundColor: "royalblue",
            justifyContent: "center",
            padding: 10,
          }}
          onPress={shuffle} //handleRefresh}
        >
          <Text>{"Shuffle"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            backgroundColor: "royalblue",
            justifyContent: "center",
            padding: 10,
          }}
          onPress={handleSort} //handleRefresh}
        >
          <Text>{"Sort"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          minHeight: data.length * ListItemHeight,
          width: width * 0.85,
        }}
        showsVerticalScrollIndicator={false}
      >
        {transitions((style, item, _, index) => (
          <AnimatedView
            style={{
              zIndex: data.length - index,
              bottom: style.y,
              height: style.height,
              opacity: style.opacity,
              marginVertical: 5,
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
