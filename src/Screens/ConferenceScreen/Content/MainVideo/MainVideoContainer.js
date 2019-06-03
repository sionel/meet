import React from 'react';
import MainVideoPresenter from './MainVideoPresenter';

/**
 * MainVideoContainer : 화상대화 화면
 */
class MainVideoContainer extends React.Component {
  state = {
    time: 0
    // objectFit: 'contain'
  };

  componentDidMount() {
    this._timer = setInterval(() => {
      this.setState({
        time: Math.floor((Date.now() - this.props.createdTime) / 1000)
      });
    }, 100);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps !== this.props) return true;
    if (nextState !== this.state) return true;
    return false;
  };

  componentWillUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     nextProps.isMuteVideo !== this.props.isMuteVideo ||
  //     nextProps.stream !== this.props.stream ||
  //     nextProps.videoType !== this.props.videoType ||
  //     nextProps.mainUser !== this.props.mainUser ||
  //     nextProps.callType !== this.props.callType ||
  //     nextState.time !== this.state.time ||
  //     nextState.isVideoReverse !== this.state.isVideoReverse
  //   ) {
  //     // console.log('render');
  //     return true;
  //   } else {
  //     // console.log('something is changed');
  //     return false;
  //   }
  // }

  render() {
    // console.log('RENDERING');
    return (
      <MainVideoPresenter
        {...this.props}
        {...this.state}
        // onChangeObjectFit={this._handleChangeObjectFit}
      />
    );
    // return <MainVideoPresenter {...this.props} isMuteVideo={false} />;
  }

  // _handleChangeObjectFit = () => {
  //   this.setState(({ objectFit }) => ({
  //     objectFit: objectFit === 'cover' ? 'contain' : 'cover'
  //   }));
  // };
}

export default MainVideoContainer;
