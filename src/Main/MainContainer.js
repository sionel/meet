/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from "react";
import MainPresenter from "./MainPresenter";
import { Linking } from "react-native";
import Orientation from "react-native-orientation-locker";

class MainContainer extends Component {
  componentWillMount() {
    Orientation.lockToPortrait();
  }

  componentDidMount() {
    // console.log(Linking);
    Linking.addEventListener("url", () => console.log("123131"));
  }

  handleOpenURL = event => {
    // this.navigate(event.url);
    Alert.alert("aa");
  };

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  render() {
    return <MainPresenter {...this.props} />;
  }
}
export default MainContainer;
