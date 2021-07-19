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
      <View style={styles.container}>
        <Image
          resizeMode={"contain"}
          style={[
            styles.image,
            {
              tintColor: item.color,
              // height: width / 3
              height: "90%",
            },
          ]}
          source={require("./assets/ant-icon.png")}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <Carousel
          autoplay
          autoplayDelay={500}
          autoplayInterval={1500}
          layout={"default"}
          //   ref={(ref) => (this.carousel = ref)}
          data={this.state.data}
          loop={true}
          sliderWidth={300}
          itemWidth={width / 3}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.setState({ activeIndex: index })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "purple",
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: width / 3,
  },
  image: {
    // height: 180,
    // width: 200,
    transform: [{ rotate: "270deg" }],
  },
});
