/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from "react";
import MainPresenter from "./MainPresenter";
import Orientation from "react-native-orientation-locker";
import LoginScreen from '../Screens/LoginScreen';
import { AppIntroSlide } from "../components";

class MainContainer extends Component {
  state = { isLogin: false };

  shouldComponentUpdate(nextProps, nextStates) {
    console.log(nextStates);
    if (nextStates.isLogin !== this.state.isLogin)
      return true;

    if (nextProps.user === null) {
      this.setState({ isLogin: false });
    }

    return false;
  }
  
  componentWillMount() {
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <AppIntroSlide>
        {
          this.state.isLogin
          ? <MainPresenter {...this.props} />
          : <LoginScreen handleOnLogin={this._handleOnLogin} />
        }
      </AppIntroSlide>
    );
  }

  /**
   * 로그인 권한은 LoginScreen 이 가지고 있음
   * LoginScreen 에서 _handleOnLogin을 통해서 로그인 상태를 관리함
   */
  _handleOnLogin = () => {
    this.setState({ isLogin: true });
  }
}
export default MainContainer;
