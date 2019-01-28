import React, { Component } from "react";
import SettingButtonPresenter from "./SettingButtonPresenter";

/**
 * SettingButtonContainer
 */
class SettingButtonContainer extends Component {
  render() {
    return <SettingButtonPresenter {...this.props} />;
  }
}

export default SettingButtonContainer;
