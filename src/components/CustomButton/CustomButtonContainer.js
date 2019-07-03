import React, { Component } from "react";
import CustomButtonPresenter from "./CustomButtonPresenter";

/**
 * CustomButtonContainer
 */
class CustomButtonContainer extends Component {
  render() {
    return <CustomButtonPresenter {...this.props} />;
  }
}

export default CustomButtonContainer;
