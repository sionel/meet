import React, { Component } from 'react';
import { Platform, Linking } from 'react-native';
import LoginScreenPresenter from './LoginScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import { MeetApi } from '../../services';
import { getT } from '../../utils/translateManager';

const iswehagov = WEHAGO_ENV === 'WEHAGOV';
class LoginScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joincode: ''
    };
    this.t = getT();
  }

  componentDidMount(){
    debugger
  }

  componentDidUpdate(){
    debugger
  }
  render() {
    return (
      <LoginScreenPresenter
        joincode={this.state.joincode}
        navigation={this.props.navigation}
        onWehagoLogin={this._handleLoginForWehago}
        onInputCode={this._inputCode}
        tmp={this.state.tmp}
        onTest={this.props.onTest}
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
        this.props.setAlert({
          type: 1,
          title: this.t('alert.title.error'),
          message: this.t('alert.text.no_app_store')
        });
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
      this.props.setAlert({
        type: 1,
        title: this.t('alert.title.notion'),
        message: this.t('alert.text.no_exist_joincode')
      });
    } else if (result.resultData.code === 'E00001') {
      this.props.setAlert({
        type: 1,
        title: this.t('alert.title.notion'),
        message: this.t('alert.text.no_exist_joincode')
      });
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
