import React, { Component } from "react";
import ControlButtonPresenter from "./ControlButtonPresenter";

/**
 * ControlButtonContainer
 */
class ControlButtonContainer extends Component {
  render() {
    return <ControlButtonPresenter {...this.props} />;
  }
}

export default ControlButtonContainer;
