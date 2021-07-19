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

  setLikelihood = (newLikelihood) => {
    this.setState({ likelihood: newLikelihood }, () => {
      if (this.props.onChange) {
        this.props.onChange(newLikelihood, this.props.item.name);
      }
    });
  };

  calculateLikelihood = () => {
    this.setState({ hasRun: true, likelihood: 0 });

    let calculator = generateAntWinLikelihoodCalculator();
    calculator(this.setLikelihood);
  };

  componentDidMount() {
    if (this.props.item.likelihood !== undefined)
      this.setState({ likelihood: this.props.item.likelihood });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.item.likelihood !== this.props.item.likelihood) {
      if (this.props.item.likelihood !== undefined)
        this.setState({ likelihood: this.props.item.likelihood });
    } else if (
      prevProps.refreshing !== this.props.refreshing &&
      this.props.refreshing
    ) {
      this.calculateLikelihood();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.item !== nextProps.item) return true;
    else if (this.state.likelihood !== nextState.likelihood) return true;
    else if (this.state.hasRun !== nextState.hasRun) return true;
    return false;
  }

  render() {
    const { item } = this.props;

    return (
      <View
        style={{
          borderWidth: 1,
          height: 125,
        }}
      >
        <Text
          style={{
            borderWidth: 0.5,
            fontSize: 20,
            paddingVertical: 5,
            textAlign: "center",
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            // alignItems: "center",
            flexDirection: "row",
            // justifyContent: "flex-start",
            paddingVertical: 5,
          }}
        >
          <View
            style={{
              alignItems: "center",
              flex: 3,
            }}
          >
            <Text
              style={{
                color: "navy",
                fontSize: 14,
                marginVertical: 10,
              }}
            >
              {"Winning odds:\t"}
              {this.state.likelihood === 0
                ? this.state.hasRun
                  ? "Calculating..."
                  : "Not yet run"
                : this.state.likelihood.toFixed(5)}
            </Text>
            <TouchableOpacity
              style={{
                alignItems: "center",
                backgroundColor: "royalblue",
                height: 30,
                justifyContent: "center",
                width: "80%",
              }}
              onPress={this.calculateLikelihood}
            >
              <Text>{"RELOAD"}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center",
              flex: 2,
              justifyContent: "center",
            }}
          >
            <Image
              resizeMode={"stretch"}
              source={require("./assets/ant-icon.png")}
              style={{
                tintColor: item.color.toLowerCase(),
                height: item.length * 3.5,
                width: item.weight * 16,
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}
