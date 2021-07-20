import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { create as apiCreate } from "apisauce";
import AntCard from "./AntCard";
const { height, width } = Dimensions.get("window");
import _ from "lodash";
import MyCarousel from "./MyCarousel";
import AuthContext from "./context";
import WelcomeScreen from "./WelcomeScreen";

import MyButton from "./MyButton";
import { useTransition, animated } from "@react-spring/native";
const AnimatedView = animated(View);
const ListItemHeight = 100;

export default function App() {
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const [size, setSize] = useState({ width, height });
  const myCarousel = useRef();

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
      Alert.alert("Error retrieving data", "Please pull down to refresh", [
        {
          text: "OK",
        },
      ]);
      setData([]);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const eventHandler = (newLikelihood, name) => {
    let sortedData = [...data];
    let index = sortedData.findIndex((el) => el.name === name);
    sortedData[index] = { ...sortedData[index], likelihood: newLikelihood };
    setData(
      _.orderBy(sortedData, ({ likelihood }) => likelihood || 0, ["desc"])
    );
  };

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

  const EmptyComponent = ({ title }) => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 30,
        }}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthContext.Provider value={{ user, setUser }}>
        {user ? (
          <>
            <StatusBar style="auto" />
            {data.length > 0 && (
              <View style={styles.buttonBox}>
                <MyButton
                  color={"dodgerblue"}
                  onPress={handleRefresh}
                  text={"RUN ODDS"}
                />
                <MyButton
                  color={"lightgrey"}
                  onPress={shuffle}
                  text={"SHUFFLE"}
                />
              </View>
            )}

            <Text>{"Logged in as:\t" + user}</Text>
            <ScrollView
              contentContainerStyle={[
                { minHeight: data.length * ListItemHeight },
                styles.scrollViewContainer,
              ]}
              ListEmptyComponent={
                <EmptyComponent title="Nothing here, come back later.." />
              }
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            >
              {data.length > 0 &&
                transitions((style, item, _, index) => (
                  <AnimatedView
                    style={{
                      zIndex: data.length - index,
                      bottom: style.y,
                      height: style.height,
                      opacity: style.opacity,
                      marginVertical: 5,
                    }}
                    key={item.name}
                  >
                    <AntCard
                      item={item}
                      refreshing={refreshing}
                      onChange={eventHandler}
                    />
                  </AnimatedView>
                ))}
            </ScrollView>
            <View style={styles.buttonBox}>
              <MyButton
                text={"LOG OUT"}
                color={"darkgrey"}
                onPress={() => setUser(null)}
              />
            </View>
            <MyCarousel ref={myCarousel} />
          </>
        ) : (
          <WelcomeScreen setUser={setUser} />
        )}
      </AuthContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollViewContainer: {
    width: width * 0.85,
  },
});
