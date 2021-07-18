import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { create as apiCreate } from "apisauce";
import create from "zustand";
const { height, width } = Dimensions.get("window");

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export default function App() {
  const [data, setData] = useState([]);

  const myURL = "https://hacker-news.firebaseio.com/v0/";
  const myEndpoint = "item/9067.json";

  // const getItem = () => fetch(myURL + myEndpoint);
  const client = apiCreate({ baseURL: myURL });
  const getItem = () => client.get(myEndpoint);

  const loadData = async () => {
    const response = await getItem();
    if (response.ok) {
      // const json = await response.json();
      setData([response.data]);
    } else {
      console.log(response);
    }
  };

  useEffect(() => {
    loadData();
    // fetch(myURL + myEndpoint)
    //   .then((response) => response.json())
    //   .then((json) => {
    //     console.log(json);
    //     setData([json]);
    //   });
  }, []);

  const keyExtractor = (item, index) => String(item.id);

  const renderItem = ({ item }) => (
    <Text
      // onPress={() => Linking.openURL("https://www.reverb.com")}
      style={{ color: "blue" }}
    >
      {item.text}
    </Text>
  );

  const contentContainerStyle = { width: width * 0.75 };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
