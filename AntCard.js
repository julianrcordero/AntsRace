import React, { Component } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import generateAntWinLikelihoodCalculator from "./LikelihoodGenerator";

export default class AntCard extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    likelihood: 0, //not yet run
  };

  calculator = generateAntWinLikelihoodCalculator();

  setLikelihood = (likelihood) => {
    this.setState({ likelihood }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.likelihood, this.props.item.name);
      }
    });
  };

  calculateLikelihood = () => {
    this.setState({ likelihood: 0 });
    this.calculator(this.setLikelihood);
  };

  componentDidMount() {
    console.log(this.props.item.name, "mounting");
    this.calculateLikelihood();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.item.likelihood !== this.props.item.likelihood) {
      this.setState({ likelihood: this.props.item.likelihood });
    } else if (prevState.likelihood !== this.state.likelihood) {
      console.log(
        this.props.item.name.substring(0, 13),
        "\t\t",
        this.state.likelihood
      );
    } else if (prevProps.refreshing !== this.props.refreshing) {
      this.calculateLikelihood();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (this.state.likelihood !== nextState.likelihood) {
    //   return true;
    // }
    return true;
  }

  render() {
    const { item } = this.props;

    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: "cyan",
          borderWidth: 1,
          flexDirection: "row",
          height: 100,
          justifyContent: "space-between",
          marginVertical: 15,
          paddingHorizontal: 15,
        }}
      >
        <View>
          <Text style={{ color: "black", fontSize: 18 }}>
            {item.name}
            <Text style={{ color: "navy", fontSize: 12 }}>
              {/* {"\nColor:\t" + item.color}
              {"\nLength:\t" + item.length}
              {"\nWeight:\t" + item.weight} */}
              {"\nWinning odds:\t"}
              {typeof this.state.likelihood === "number"
                ? this.state.likelihood.toFixed(5)
                : this.state.likelihood}
            </Text>
          </Text>
          <TouchableOpacity
            style={{
              alignItems: "center",
              backgroundColor: "royalblue",
              height: 30,
              justifyContent: "center",
              width: 60,
            }}
            onPress={this.calculateLikelihood}
          >
            <Text>{"RELOAD"}</Text>
          </TouchableOpacity>
        </View>
        {/* <MaterialCommunityIcons
            name="bug"
            size={item.length * 5}
            color={item.color.toLowerCase()}
            iconStyle={{ marginHorizontal: 30 }}
          /> */}
        <View>
          <Image
            resizeMode={"stretch"}
            source={require("./assets/ant-icon.png")}
            style={{
              tintColor: item.color.toLowerCase(),
              height: item.length * 4,
              width: item.weight * 20,
            }}
          />
        </View>
      </View>
    );
  }
}
