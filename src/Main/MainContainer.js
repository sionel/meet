/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from "react";
import MainPresenter from "./MainPresenter";
import Orientation from "react-native-orientation-locker";
import { AppIntroSlide } from "../components";

class MainContainer extends Component {
  componentWillMount() {
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <AppIntroSlide>
        <MainPresenter {...this.props} />
      </AppIntroSlide>
    );
  }
}
export default MainContainer;
