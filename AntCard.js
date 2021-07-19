import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import generateAntWinLikelihoodCalculator from "./LikelihoodGenerator";

export default class AntCard extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    likelihood: 0,
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

    const imageStyle = {
      tintColor: item.color.toLowerCase(),
      height: item.length * 2.5,
      width: item.weight * 12,
    };

    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.oddsBox}>
            <Text
              style={[
                styles.oddsText,
                { color: this.state.likelihood === 0 ? "grey" : "blue" },
              ]}
            >
              <Text style={styles.label}>{"Winning odds:\t"}</Text>
              {this.state.likelihood === 0
                ? this.state.hasRun
                  ? "Calculating..."
                  : "Not yet run"
                : this.state.likelihood.toFixed(5)}
            </Text>
            <TouchableOpacity
              style={styles.reloadButton}
              onPress={this.calculateLikelihood}
            >
              <Text>{"RELOAD"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageBox}>
            <Image
              resizeMode={"stretch"}
              source={require("./assets/ant-icon.png")}
              style={imageStyle}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    height: 100,
    justifyContent: "space-evenly",
  },
  imageBox: {
    alignItems: "center",
    flex: 2,
    justifyContent: "center",
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 5,
  },
  label: {
    color: "black",
    fontWeight: "bold",
  },
  oddsBox: {
    alignItems: "center",
    flex: 3,
    marginHorizontal: 10,
  },
  oddsText: {
    color: "darkblue",
    fontSize: 14,
    marginVertical: 5,
  },
  reloadButton: {
    alignItems: "center",
    borderWidth: 0.2,
    // backgroundColor: "royalblue",
    height: 25,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  titleBox: {
    borderBottomWidth: 0.5,
    flex: 1,
    justifyContent: "center",
  },
});
