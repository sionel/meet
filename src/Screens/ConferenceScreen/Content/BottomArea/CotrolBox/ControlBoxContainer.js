import React from "react";
import ControlBoxPresenter from "./ControlBoxPresenter";

class ControlBoxContainer extends React.Component {
  render() {
    console.log(this.props);
    return <ControlBoxPresenter {...this.props} />;
  }
}

export default ControlBoxContainer;
