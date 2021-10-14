import React from "react";
import ParticipantBoxPresenter from "./ParticipantBoxPresenter";

class ParticipantBoxContainer extends React.Component {
  render() {
    return <ParticipantBoxPresenter {...this.props} />;
  }
}

export default ParticipantBoxContainer;
