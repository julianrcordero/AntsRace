import React, { Component } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import generateAntWinLikelihoodCalculator from "./LikelihoodGenerator";

export default class AntCard extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    likelihood: 0, //not yet run
    hasRun: false,
  };

  calculator = generateAntWinLikelihoodCalculator();

  setLikelihood = (likelihood) => {
    this.setState(
      { likelihood }
      // () => {
      //   if (this.props.onChange) {
      //     this.props.onChange(likelihood, this.props.item.name);
      //   }
      // }
    );
  };

  calculateLikelihood = () => {
    this.setState({ hasRun: true });
    this.calculator(this.setLikelihood);
  };

  // componentDidMount() {
  //   // console.log(this.props.item.name, "mounting");
  //   if (this.state.likelihood === 0) this.calculateLikelihood();
  // }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.refreshing !== this.props.refreshing) {
    //   console.log("refreshing", this.props.refreshing, this.props.item.name);
    //   // this.calculateLikelihood();
    // }
    // else if (prevProps.item !== this.props.item) {
    //   // console.log(prevProps.item.name, this.props.item.name);
    //   this.calculateLikelihood();
    // } else
    if (prevProps.item.likelihood !== this.props.item.likelihood) {
      this.setState({ likelihood: this.props.likelihood });
      console.log(
        this.props.item.name.substring(0, 13),
        "\t\t",
        this.props.likelihood
      );
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
              {"\nWinning odds:\t"}
              {this.state.likelihood === 0
                ? this.state.hasRun
                  ? "In progress..."
                  : "Not yet run"
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
