/**
 * ConferenceStateContainer
 * 화상회의 전 화면들
 *
 */

import React from 'react';
import { Platform, Dimensions, Alert } from 'react-native';
import ConferenceStatePresenter from './ConferenceStatePresenter';
import { MeetApi } from '../../services';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { v4 as uuidv4 } from 'uuid';

const { width, height } = Dimensions.get('window'); // TODO: 꼭 해야함
const isTablet = DeviceInfo.isTablet();

class ConferenceStateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.enterTimer;
    this.state = {
      conferenceState: 'loading',
      isTablet
    };
  }

  async componentDidMount() {
    // 로그인 된 상태서 접근
    // 딥링크 모바일 접근
    // 딥링크 웹 접근
    // 딥링크 이메일 접근
    // 참여코드 접근
    const { params } = this.props.screenProps;
    let roomId;
    if (this.props.from === 'list') {
      roomId = this.props.navigation.state.params.item.roomId;
    } else {
      roomId = params.roomId;
    }

    const iscret =
      params.accesstype !== 'email' && params.accesstype !== 'joincode';

    let { conferenceState } = this.state;
    this.roomId = roomId;

    let { auth } = this.props;
    const access = await MeetApi.getMeetRoomNoCert(roomId);
    this.roomName = access.resultData.name;

    if (!access) {
      // 종료된 방 또는 문제가 있을때
      conferenceState = 'deleted';
    } else {
      if (access.resultData.r_start_datetime) {
        // 예약방
        const now = new Date().getTime();
        const start = access.resultData.r_start_datetime;
        if (start - now >= 1800000) {
          // 30분 이상 남음
          // 180만 밀리세컨 = 30분
          conferenceState = 'reservationInfo';
        } else if (start - now < 0) {
          // 이미 시작함
          conferenceState = 'conference';
        } else {
          // 30분 미만 남음
          conferenceState = 'wating';
        }
      } else {
        // 지금 실행 방
        conferenceState = 'conference';
      }
    }

    const dateFormat = date => {
      let changed = new Date(date);
      return (
        changed.getFullYear() +
        '-' +
        (changed.getMonth() + 1 + '').padStart(2, '0') +
        '-' +
        (changed.getDate() + '').padStart(2, '0') +
        ' ' +
        (changed.getHours() + '').padStart(2, '0') +
        ':' +
        (changed.getMinutes() + '').padStart(2, '0')
      );
    };

    if (conferenceState === 'conference') {
      // 50명 체크
      // 토큰받고
      // 접속

      this._handleEnterConference(auth, roomId, iscret, params);
    } else if (conferenceState === 'reservationInfo') {
      // 참석자 정보 받고
      // 시작시간 종료시간 컨버팅 하고
      // 페이지 이동
      const {
        name,
        r_start_datetime,
        r_end_datetime,
        is_public
      } = access.resultData;
      let accessUser = [];
      if (Object.keys(auth).length > 0) {
        accessUser = (
          await MeetApi.getAccessUsers(
            auth.AUTH_A_TOKEN,
            auth.AUTH_R_TOKEN,
            auth.HASH_KEY,
            auth.last_access_company_no,
            roomId
          )
        ).resultData;
      }
      this.setState({
        iscret,
        conferenceState,
        name,
        accessUser,
        isPublic: is_public,
        start: dateFormat(r_start_datetime),
        end: dateFormat(r_end_datetime)
      });
    } else if (conferenceState === 'wating') {
      // 날짜 변환하고
      // setTimeout 걸어줌
      const now = new Date().getTime();
      const start = access.resultData.r_start_datetime;

      this.enterTimer = setTimeout(() => {
        this._handleEnterConference(auth, roomId);
      }, start - now);

      this.setState({
        iscret,
        conferenceState,
        start: dateFormat(start)
      });
    } else if (conferenceState === 'deleted') {
      // 그냥 던져
      this.setState({
        iscret,
        conferenceState: conferenceState
      });
    }

    Orientation.getOrientation(orientation => {
      const status =
        orientation === 'LANDSCAPE' ||
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT';
      this.setState({
        iscret,
        orientation: status ? 'horizontal' : 'vertical'
      });
    });
    Orientation.addOrientationListener(this._handleOrientation);
  }

  componentWillUnmount() {
    clearTimeout(this.enterTimer);
    Orientation.removeOrientationListener(this._handleOrientation);
  }

  render() {
    // const { conferenceState } = this.state;

    return (
      // <View style={{ flex: 1 }}>
      <ConferenceStatePresenter {...this.state} />
      // </View>
    );
  }

  _handleOrientation = orientation => {
    const status =
      orientation === 'LANDSCAPE' ||
      orientation === 'LANDSCAPE-LEFT' ||
      orientation === 'LANDSCAPE-RIGHT';
    this.setState({ orientation: status ? 'horizontal' : 'vertical' });
  };

  _handleRedirect = (url, param) => {
    const { navigation } = this.props;
    // 여기서 어디로 이동을 한다면 conference밖에 없고
    // 네비게이션 특성상 홈으로 갔다가 가야함
    navigation.navigate('Home');
    navigation.navigate(url, param);
  };
  _handleEnterConference = async (auth, roomId, iscret, params) => {
    let callType = 3;
    let isCreator;

    let participantList = [];
    // 50명 체크는 여기서 하되 토큰받는 작업은 setting 페이지에서 함
    if (iscret) {
      participantList = (
        await MeetApi.getParticipant(
          auth.AUTH_A_TOKEN,
          auth.AUTH_R_TOKEN,
          auth.HASH_KEY,
          auth.last_access_company_no,
          roomId
        )
      ).resultData;
    } else {
      // 비인증 인원수
    }

    // 최대 참여인원 제한 (50명)
    if (participantList.length >= 50) {
      // 50명 초과 방 ㄱ
      conferenceState = 'fullroom';

      this.setState({
        conferenceState: conferenceState
      });
    } else {
      this._handleRedirect('Setting', {
        item: {
          roomType: 'meet',
          videoRoomId: roomId,
          callType,
          isCreator,
          selectedRoomName: this.roomName,
          params
        }
      });
    }
  };
}

export default ConferenceStateContainer;
