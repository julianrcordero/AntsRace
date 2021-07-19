import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
const { height, width } = Dimensions.get("window");
import _ from "lodash";

import Carousel from "react-native-snap-carousel";
import { render } from "react-dom";

export default class MyCarousel extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    data: [
      {
        title: "Ant 1",
        color: "red",
      },
      {
        title: "Ant 2",
        color: "green",
      },
      {
        title: "Ant 3",
        color: "blue",
      },
    ],
  };

  _renderItem({ item, index }) {
    return (
      <View style={styles.imageBox}>
        <Image
          resizeMode={"contain"}
          style={[
            styles.image,
            {
              tintColor: item.color,
            },
          ]}
          source={require("./assets/ant-icon.png")}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Carousel
          autoplay
          autoplayDelay={500}
          autoplayInterval={1500}
          data={this.state.data}
          loop
          sliderWidth={300}
          itemWidth={width / 3}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    transform: [{ scaleX: -1 }],
  },
  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: width / 3,
  },
  image: {
    height: "90%",
    transform: [{ rotate: "270deg" }],
  },
});
