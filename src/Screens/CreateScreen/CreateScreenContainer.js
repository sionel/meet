import React from 'react';
import { StatusBar, Platform, View } from 'react-native';

import CreateScreenPresenter from './CreateScreenPresenter';
import { ConferenceApi } from '../../services';
import { MeetApi } from '../../services';
import { NavigationEvents } from 'react-navigation';

import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import { getT } from '../../utils/translateManager';

const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

class CreateScreenContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false, // 리프레시 상태
      searchKeyword: '', // 검색인풋
      selectedRoomId: null,
      selectedRoomName: null,
      modal: false,
      url: null,
      orientation: 'UNKNOWN'
    };
    this.t = getT();
  }

  componentDidMount() {
    Orientation.getOrientation(orientation => {
      this.setState({ orientation });
    });
    Orientation.addOrientationListener(this._handleOrientation);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._handleOrientation);
  }

  render() {
    const { searchKeyword } = this.state;
    let wetalk = []; // We talk list
    if (searchKeyword) {
      wetalk = this.props.wetalk.filter(item =>
        item.room_title.toLowerCase().includes(searchKeyword.toLowerCase())
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
          }}
          onDidBlur={() => (this._isFocus = false)}
        />
        <CreateScreenPresenter
          {...this.state}
          list={wetalk}
          onSearch={this._handleSearch}
          onActivateModal={this._handleActivateModal}
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

  _handleOrientation = orientation => {
    this.setState({ orientation });
  };

  _handleRedirect = (url, param) => {
    const { navigation } = this.props;
    navigation.navigate('Home');
    navigation.navigate(url, param);
  };

  _handleSearch = searchKeyword => {
    this.setState({ searchKeyword });
  };

  _handleCreateConference = async (externalData = null) => {
    let auth;
    let company_code;
    // 위하고에서 접속인지 아닌지 구분

    const { selectedRoomId, selectedRoomName } = this.state;

    auth = this.props.auth;
    company_code = auth.employee_list.filter(
      e => e.company_no == auth.last_access_company_no
    )[0].company_code;
    let createResult;

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
    // 화상회의 생성가능여부 // 대화방 생성 or 참여 여부 결정
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

      const videoRoomId = sendWetalkResult.resultData.chatList[0].mobile_key;

      // 토큰받고
      const roomToken = (
        await MeetApi.getMeetRoomToken(
          auth.AUTH_A_TOKEN,
          auth.AUTH_R_TOKEN,
          auth.HASH_KEY,
          auth.last_access_company_no,
          videoRoomId
        )
      ).resultData;

      let callType = 3;
      let isCreator;

      // 대화방에 참여한다.
      this._handleRedirect('Setting', {
        item: {
          videoRoomId,
          selectedRoomName,
          roomType: 'meet',
          roomToken,
          callType,
          isCreator
        }
      });
    } else if (createResult.resultCode === 400) {
      alert(createResult.resultMsg);
      // 이미 화상채팅방이 생성되어 있습니다. 대화방당 1개의 화상채팅방을 제공합니다
    } else if (createResult.errors && createResult.errors.code === 'E002') {
      this._handleRefresh();
    } else {
      alert(this.t('alert.text.생성실패'));
    }
  };

  _handleActivateModal = (selectedRoomId = null, selectedRoomName = null) => {
    this.setState(prev => ({
      modal: !prev.modal,
      selectedRoomId,
      selectedRoomName
    }));
  };
}

export default CreateScreenContainer;
