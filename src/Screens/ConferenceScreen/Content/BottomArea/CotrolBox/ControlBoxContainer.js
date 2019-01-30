import React from "react";
import ControlBoxPresenter from "./ControlBoxPresenter";

class ControlBoxContainer extends React.Component {
  render() {
    return <ControlBoxPresenter {...this.props} />;
  }
}

export default ControlBoxContainer;
