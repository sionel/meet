import React from "react";
import TopAreaPresenter from "./TopAreaPresenter";

/**
 * TopAreaContainer
 */
class TopAreaContainer extends React.Component {
  render() {
    return <TopAreaPresenter {...this.props} />;
  }
}

export default TopAreaContainer;
