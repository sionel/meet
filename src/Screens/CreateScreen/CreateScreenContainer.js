/**
 * CreateScreenContainer
 *
 * 메인페이지
 */

import React, { Component, Fragment } from 'react';
import {
  AppState,
  StatusBar,
  Linking,
  Platform,
  NativeModules,
  View
} from 'react-native';

import CreateScreenPresenter from './CreateScreenPresenter';
// service
// import { WetalkApi } from '../../services';
// import { UserApi } from '../../services';
import { ConferenceApi } from '../../services';
import { MeetApi } from '../../services';
import { NavigationEvents } from 'react-navigation';
// import { querystringParser } from '../../utils';

import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

class CreateScreenContainer extends React.Component {
  /**
   * STATE
   */
  state = {
    refreshing: false, // 리프레시 상태
    searchKeyword: '', // 검색인풋
    selectedRoomId: null,
    selectedRoomName: null,
    modal: false,
    url: null,
    orientation: 'UNKNOWN'
  };

  componentDidMount() {
    Orientation.getOrientation(orientation => {
      this.setState({ orientation });
    });
    Orientation.addOrientationListener(this._handleOrientation);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    Orientation.removeOrientationListener(this._handleOrientation);
  }

  /**
   * Rendering
   */
  render() {
    const { refreshing, searchKeyword, selectedRoomId, modal } = this.state;
    const { navigation, auth } = this.props;
    let wetalk = []; // We talk list

    if (searchKeyword) {
      wetalk = this.props.wetalk.filter(item =>
        item.room_title.toLowerCase().match(searchKeyword.toLowerCase())
      );
    } else {
      wetalk = this.props.wetalk;
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={'#1C90FB'} />
        <NavigationEvents
          onDidFocus={() => {
            this._isFocus = true;
            // this._handleRefressAfterWhile();
          }}
          onDidBlur={() => (this._isFocus = false)}
        />
        <CreateScreenPresenter
          {...this.state}
          list={wetalk}
          onSearch={this._handleSearch}
          onRedirect={this._handleRedirect}
          onActivateModal={this._handleActivateModal}
          onCheckConference={this._handleCheckConference}
          onCreateConference={this._handleCreateConference}
          onRefresh={this._handleRefresh}
          orientation={this.state.orientation}
          hasNotch={hasNotch}
        />
      </View>
    );
  } // render

  _handleRefresh = () => {
    this.props.navigation.state.params.onGetWetalkList();
  };

  /**
   * _handleOrientation
   */
  _handleOrientation = orientation => {
    this.setState({ orientation });
  };

  /**
   * _handleRedirect
   * 페이지 이동
   */
  _handleRedirect = (url, param) => {
    const { navigation } = this.props;
    navigation.navigate('Home');
    navigation.navigate(url, param);
  };

  /**
   * _handleSearch
   * 검색 필터
   */
  _handleSearch = searchKeyword => {
    this.setState({ searchKeyword });
  };

  /**
   * _handleCreateConference
   * 화상대화 생성
   */
  _handleCreateConference = async (externalData = null) => {
    let auth;
    let company_code;
    // 위하고에서 접속인지 아닌지 구분

    const { selectedRoomId, selectedRoomName } = this.state;
    console.log(this.props);

    auth = this.props.auth;
    company_code = auth.employee_list.filter(
      e => e.company_no == auth.last_access_company_no
    )[0].company_code;
    let createResult;

    // FIXME: 업데이트 여부에 따라 보낼 api 수정 해야하는데 당장은 wetalk쪽에서 기존 api를 살릴 수 있도록 처리를 해줌 느긋하게 해도 됨
    // let flag = this.props.didupdate // 디버깅 할려고 강제로 넣은 플레그 if 문 수정해야함
    // if (flag) { 
    //   const param = {
    //     service_code: 'communication',
    //     is_public: true,
    //     name: selectedRoomName, 
    //     communication_id: selectedRoomId 
    //   };
    //   createResult = await MeetApi.createMeetRoom(
    //     auth.AUTH_A_TOKEN,
    //     auth.AUTH_R_TOKEN,
    //     auth.HASH_KEY,
    //     auth.last_access_company_no,
    //     param
    //   );
    // } else {
      const bodyData = [
        selectedRoomId, // 방 id
        auth.portal_id, // 유저아이디
        auth.user_name, // 유저이름
        auth.last_access_company_no, // 회사번호
        company_code, // 회사코드
        auth.AUTH_A_TOKEN, // 토큰
        auth.AUTH_R_TOKEN, // 토큰
        auth.HASH_KEY
        // null
      ];
      createResult = await ConferenceApi.create(...bodyData);
    // }

    // 화상대화 생성가능여부 // 대화방 생성 or 참여 여부 결정
    if (createResult.resultCode === 200) {
      // 생성완료 메시지 보내기
      const sendWetalkResult = await ConferenceApi.sendWetalk(
        selectedRoomId,
        createResult.resultData,
        auth.last_access_company_no,
        company_code,
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.HASH_KEY
      );
      this.setState({ modal: false });

      // 대화방에 참여한다.
      const videoRoomId = sendWetalkResult.resultData.chatList[0].mobile_key;
      this._handleRedirect('Conference', {
        item: { videoRoomId, selectedRoomName: this.state.selectedRoomName }
      });
    } else if (createResult.resultCode === 400) {
      alert(createResult.resultMsg);
      // 이미 화상채팅방이 생성되어 있습니다. 대화방당 1개의 화상챝ㅇ방을 제공합니다
    } else if (createResult.errors && createResult.errors.code === 'E002') {
      this._handleRefresh();
    } else {
      alert('화상대화 생성에 실패하였습니다. 다시 시도해 주세요');
    }
  };

  /**
   * _handleActivateModal
   * 모달뷰 토글
   */
  _handleCheckConference = async (conferenceId, externalData = null) => {
    let { auth } = this.props;
    let callType = 3;
    let isCreator;
    // 위하고에서 접속인지 아닌지 구분
    if (externalData !== null) {
      auth = {
        conferenceId,
        portal_id: externalData.owner_id,
        user_name: externalData.owner_name,
        last_access_company_no: externalData.cno,
        AUTH_A_TOKEN: externalData.access
      };

      callType = externalData.call_type; // 1:화상 / 2:음성
      isCreator = externalData.is_creater; // 1:생성자 / 2:참여자
    } else {
      // 생성여부 체크
      const result = await ConferenceApi.check(
        conferenceId,
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.HASH_KEY
      );
      if (!result.resultData) {
        // alert(result.resultMsg);
        return;
      }
    }
    // 화상대화로 진입
    this._handleRedirect('Conference', {
      item: {
        videoRoomId: conferenceId,
        callType,
        isCreator,
        selectedRoomName: this.state.selectedRoomName
      }
    });
  };

  /**
   * _handleActivateModal
   * 모달뷰 토글
   */
  _handleActivateModal = (selectedRoomId = null, selectedRoomName = null) => {
    this.setState(prev => ({
      modal: !prev.modal,
      selectedRoomId,
      selectedRoomName
    }));
  };
}

export default CreateScreenContainer;
