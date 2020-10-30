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
      refs: [],
      joincode: ['*', '*', '*', '*', '*', '*']
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <LoginScreenPresenter
        navigation={this.props.navigation}
        refs={this.state.refs}
        onWehagoLogin={this._handleLoginForWehago}
        onInputCode={this._inputCode}
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

  _inputCode = (code, index) => {
    let { joincode } = this.state;
    joincode[index] = code;
    if (index === 5 && joincode.indexOf('*') === -1) {
      debugger;
      joincode = joincode.reduce((e, v) => e + v, '');
      this._enterConference(joincode);
    }
  };
  _enterConference = async joincode => {
    const result = await MeetApi.searchJoincode(joincode);
    if (!result) {
      Aalert(
        '요청된 작업을 처리하던중 문제가 발생했습니다. 다시 시도해 주세요'
      );
    } else if (result.resultData.code === 'E00001') {
      Alert.alert('알림', '존재하지 않는 접속코드 입니다.');
    } else {
      this.props.onChangeRootState({
        loaded: true,
        destination: 'Setting',
        params: {
          accesstype: 'joincode'
        }
      });
    }
  };
}

export default LoginScreenContainer;
