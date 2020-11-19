import React, { Component } from 'react';
import { Platform, Linking, Alert } from 'react-native';
import LoginScreenPresenter from './LoginScreenPresenter';
import { WEHAGO_TYPE, WEHAGO_ENV } from '../../../config';
import { MeetApi } from '../../services';

const iswehagov = WEHAGO_ENV === 'WEHAGOV';

const bg = require('../../../assets/bgIntroWehagoIphoneX_3x.png');

class LoginScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joincode: ''
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <LoginScreenPresenter
        joincode={this.state.joincode}
        navigation={this.props.navigation}
        onWehagoLogin={this._handleLoginForWehago}
        onInputCode={this._inputCode}
        tmp={this.state.tmp}
      />
    );
  }

  _handleLoginForWehago = () => {
    let serviceCode;
    if (iswehagov) {
      serviceCode = Platform.OS === 'ios' ? 'wehagovmeet' : 'meetv';
    } else {
      serviceCode = Platform.OS === 'ios' ? 'wehagomeet' : 'meet';
    }

    const iosUrl = `wehago${iswehagov ? 'v' : ''}://?${serviceCode}=login`;
    const androidUrl = `wehago${
      iswehagov ? 'v' : ''
    }://app?name=${serviceCode}&login=true`;
    const iosMarketURL = iswehagov
      ? 'https://www.wehagov.com/#/mobile'
      : 'http://itunes.apple.com/kr/app/wehago/id1363039300?mt=8';
    const androidMarketURL = iswehagov
      ? 'https://www.wehagov.com/#/mobile'
      : 'https://play.google.com/store/apps/details?id=com.duzon.android.lulubizpotal';

    Linking.openURL(Platform.OS === 'ios' ? iosUrl : androidUrl).catch(err => {
      Linking.openURL(
        Platform.OS === 'ios' ? iosMarketURL : androidMarketURL
      ).catch(err => {
        Alert.alert(
          '스토어에서 해당 앱을 찾을 수 없습니다.',
          '',
          [{ text: 'OK' }],
          {
            cancelable: true
          }
        );
      });
    });
  };

  _inputCode = async code => {
    let { joincode } = this.state;

    joincode = code.trim();

    this.setState({
      ...this.state,
      joincode
    });
    if (joincode.length === 6) {
      await this._enterConference(joincode);

      this.setState({
        ...this.state,
        joincode: ''
      });
    }
  };
  _enterConference = async joincode => {
    const result = await MeetApi.searchJoincode(joincode);
    if (!result) {
      Alert.alert('알림', '존재하지 않는 접속코드 입니다.');
    } else if (result.resultData.code === 'E00001') {
      Alert.alert('알림', '존재하지 않는 접속코드 입니다.');
    } else {
      this.props.onChangeRootState({
        loaded: true,
        destination: 'Setting',
        params: {
          accesstype: 'joincode',
          roomId: result.resultData.room,
          joincode
        }
      });
    }
  };
}

export default LoginScreenContainer;
