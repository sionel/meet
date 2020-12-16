/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from 'react';
import { View, Alert, Linking, Platform, ToastAndroid } from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import MainPresenter from './MainPresenter';
import LoginNavigation from '../Navigations/LoginNavigation';
// import LoginRoute from '../Routes/LoginRoute';
import CompanySelect from '../components/CompanySelect';
import AppIntroSlide from '../components/AppIntroSlide';
import { CustomAlert } from '../components';

// service
import { querystringParser } from '../utils';
import ServiceCheckApi from '../services/api/ServiceCheckApi';

import { WEHAGO_ENV } from './../../config';

// 로그인 했을때 정보를 저장
// 딥링크 타고 들어오면 정보를 저장?
// 로그인, 딥링크, 위하고 로그인 3개를 비교해봐야함

class MainContainer extends Component {
  constructor(props) {
    super();
    this.state = {
      isLogin: false,
      hasService: false,
      url: null,
      alert: {
        visible: false,
        type: 0,
        description: '',
        actions: [],
        onClose: () => {}
      }
    };
  }

  // conferenceCall = null;

  componentDidMount() {
  }

  render() {
    const { params, destination, onChangeRootState, from } = this.props;
    return (
      <View style={{ flex: 1, width: '100%', hight: '100%' }}>
        <MainPresenter
          params={params}
          from={from}
          destination={destination}
          onChangeRootState={onChangeRootState}
          onChangeMainState={this._handleChangeMainState}
        />
      </View>
    );
  }

  _handleChangeMainState = state => {
    this.setState({
      ...this.state,
      ...state
    });
  };
}
export default MainContainer;
