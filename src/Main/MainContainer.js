/**
 * MainContainer
 * 최상위화면 컨테이너
 */
<<<<<<< HEAD
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
=======
import React, { Component } from 'react';
import MainPresenter from './MainPresenter';
import Orientation from 'react-native-orientation-locker';
import { Platform, Linking } from 'react-native';

class MainContainer extends Component {
	componentWillMount() {
		Orientation.lockToPortrait();
	}

	render() {
		return <MainPresenter {...this.props} />;
	}
>>>>>>> 7481d00bf91f28ae891df997760de0a64d935ece
}
export default MainContainer;
