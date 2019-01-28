import React from "react";
import SubVideoBoxPresenter from "./SubVideoBoxPresenter";

class SubVideoBoxContainer extends React.Component {
  render() {
    return <SubVideoBoxPresenter {...this.props} />;
  }
}

export default SubVideoBoxContainer;
