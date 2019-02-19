import React from "react";
import MainVideoPresenter from "./MainVideoPresenter";

/**
 * MainVideoContainer : 화상대화 화면
 */
class MainVideoContainer extends React.Component {
  state = {
    time: 0
  };
  componentDidMount() {
    setInterval(() => {
      this.setState({
        time: this.state.time + 1
      });
    }, 1000);
  }
  render() {
    return <MainVideoPresenter {...this.props} time={this.state.time} />;
    // return <MainVideoPresenter {...this.props} isMuteVideo={false} />;
  }
}

export default MainVideoContainer;
