import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';

import CreateScreenPresenter, { section } from './CreateScreenPresenter';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { WetalkApi } from '../../services';
import { ConferenceApi } from '../../services';
import { MeetApi } from '../../services';

import {
  actionCreators as AlertActions,
  params as alertParam
} from '../../redux/modules/alert';

import { getT } from '../../utils/translateManager';
import { wehagoDummyImageURL, wehagoMainURL } from '../../utils';

import { MainNavigationProps } from '../../Navigations/MainStack';

export default function CreateScreenContainer(props: any) {
  const initSection: section = {
    data: [],
    title: '',
    type: '',
    collapse: true,
    height: new Animated.Value(0),
    zIndex: 0
  };
  const t = getT();

  const [group, setGroup] = useState<section>(initSection);
  const [personal, setPersonal] = useState<section>(initSection);
  const [semu, setSemu] = useState<section>(initSection);
  const [suim, setSuim] = useState<section>(initSection);
  const [loaded, setLoaded] = useState(false);
  const [indicatorFlag, setIndicatorFlag] = useState(false);
  const [wetalkList, setWetalkList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [searchList, setSearchList] = useState([]);

  const { auth } = useSelector((state: RootState) => {
    const { auth } = state.user;
    return {
      auth
    };
  });

  const { navigation }: MainNavigationProps<'CreateConference'> = props;

  useEffect(() => {
    _getWetalkList();
  }, []);
  useEffect(() => {
    const list = searchList.length !== 0 ? searchList : wetalkList;

    const customList = list.map((room: any) => {
      const returnRoom = { ...room };
      returnRoom.profile =
        Object.keys(returnRoom).indexOf('room_profile_url') > 0 ? true : false;
      if (returnRoom.profile) {
        returnRoom.uri = returnRoom.room_profile_url
          ? wehagoMainURL + returnRoom.room_profile_url
          : wehagoDummyImageURL;
      } else {
        const title = returnRoom.room_title;
        const split = title.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
        returnRoom.first_char =
          split[0] === title
            ? split[0][0]
            : split[0].lenth !== 0
            ? split[0][0]
            : '';
      }

      return returnRoom;
    });

    const personalList = customList.filter(
      (item: any) => item.room_type === '1' && item.is_video_access === 'F'
    );
    const groupList = customList.filter(
      (item: any) => item.room_type === '2' && item.is_video_access === 'F'
    );
    const semuList = customList.filter(
      (item: any) => item.room_type === '4' && item.is_video_access === 'F'
    );
    const suimList = customList.filter(
      (item: any) =>
        item.room_type === '5' &&
        item.is_video_access === 'F' &&
        !item.unpaid_status
    );

    const personalData: section = {
      data: personalList,
      title: `${t('create_room_oneonone')}(${personalList.length})`,
      type: 'personal',
      collapse: false,
      height: new Animated.Value(50 * personalList.length),
      zIndex: 1
    };
    const groupData: section = {
      data: groupList,
      title: `${t('create_room_group')}(${groupList.length})`,
      type: 'group',
      collapse: false,
      height: new Animated.Value(50 * groupList.length),
      zIndex: 2
    };
    const semuData: section = {
      data: semuList,
      title: `${t('create_room_semu')}(${semuList.length})`,
      type: 'semu',
      collapse: false,
      height: new Animated.Value(50 * semuList.length),
      zIndex: 3
    };
    const suimData: section = {
      data: suimList,
      title: `${t('create_room_suim')}(${suimList.length})`,
      type: 'suim',
      collapse: false,
      height: new Animated.Value(50 * suimList.length),
      zIndex: 4
    };

    Promise.all([
      setPersonal(personalData),
      setGroup(groupData),
      setSemu(semuData),
      setSuim(suimData)
    ]).then(() => {
      setLoaded(true);
    });
  }, [wetalkList, searchList]);
  useEffect(() => {
    const wetalk = wetalkList.filter((item: any) =>
      item.room_title.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchList(wetalk);
  }, [keyword]);

  const dispatch = useDispatch();
  const setAlert = (params: alertParam) =>
    dispatch(AlertActions.setAlert(params));

  const onClickBack = () => {
    navigation.goBack();
  };
  const onClickHeader = (section: section) => {
    Animated.timing(section.height, {
      toValue: !section.collapse ? 0 : section.data.length * 50,
      useNativeDriver: false,
      duration: 400
    }).start();

    switch (section.type) {
      case 'personal':
        setPersonal({ ...section, collapse: !section.collapse });
        break;
      case 'group':
        setGroup({ ...section, collapse: !section.collapse });
        break;
      case 'semu':
        setSemu({ ...section, collapse: !section.collapse });
        break;
      case 'suim':
        setSuim({ ...section, collapse: !section.collapse });
        break;
      default:
        break;
    }
  };
  const onClickStartButton = (conference: any) => {
    const message = t('alert_text_createroom');
    const onConfirm = () => {
      _createConferenceRoom(conference);
    };
    const title = t('alert_title_create');
    const type = 1;
    setAlert({ message, onConfirm, title, type });
  };
  const onRefresh = () => {
    _getWetalkList();
  };
  const onSearch = (key: string) => {
    setKeyword(key);
  };

  const _getWetalkList = async () => {
    const { video_room_list } = await WetalkApi.getWetalkList(auth);
    setWetalkList(video_room_list);
  };

  const _createConferenceRoom = async (conference: any) => {
    setIndicatorFlag(true);
    const { room_id, room_title: roomTitle } = conference;

    const {
      last_access_company_no,
      employee_list
    } = auth;

    const company_code = employee_list.filter(
      (e: any) => e.company_no == last_access_company_no
    )[0].company_code;

    // const bodyData = [
    //   room_id, // 방 id
    //   portal_id, // 유저아이디
    //   user_name, // 유저이름
    //   last_access_company_no, // 회사번호
    //   company_code, // 회사코드
    //   AUTH_A_TOKEN, // 토큰
    //   AUTH_R_TOKEN, // 토큰
    //   HASH_KEY
    //   // null
    // ];

    const param = {
      service_code: 'communication',
      name: roomTitle,
      communication_id: room_id
    };

    const createResult = await MeetApi.createMeetRoom(auth, param);
    // await ConferenceApi.create(bodyData);

    if (createResult.resultCode === 201) {
      // 생성완료 메시지 보내기
      const sendWetalkResult = await ConferenceApi.sendWetalk(
        room_id,
        createResult.resultData.room,
        auth.last_access_company_no,
        company_code,
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.HASH_KEY
      );

      const { mobile_key: videoRoomId, room_title } =
        sendWetalkResult.resultData.chatList[0];

      // 토큰받고
      // const roomToken = (await MeetApi.getMeetRoomToken(auth, videoRoomId))
      //   .resultData;

      setIndicatorFlag(false);
      //TODO: 화상대화 포인트이용해서 필요할경우 state
      navigation.navigate('SettingView', {
        accessType: 'auth',
        id: videoRoomId,
        selectedRoomName: room_title
      });
    } else if (createResult.resultCode === 400) {
      setIndicatorFlag(false);

      const message = createResult.resultMsg;
      const title = t('alert_title_fail');
      const type = 1;
      setAlert({ message, title, type });

      // 이미 화상채팅방이 생성되어 있습니다. 대화방당 1개의 화상채팅방을 제공합니다
    } else if (createResult.errors && createResult.errors.code === 'E002') {
      setIndicatorFlag(false);
      const message = t('alert_text_failcreate');
      const title = t('alert_title_fail');
      const type = 1;
      setAlert({ message, title, type });
    } else {
      setIndicatorFlag(false);
      const message = t('alert_text_failcreate');
      const title = t('alert_title_fail');
      const type = 1;
      setAlert({ message, title, type });
    }
  };
  return (
    <CreateScreenPresenter
      {...{
        searchList,
        loaded,
        onClickBack,
        onClickHeader,
        onRefresh,
        onSearch,
        group,
        personal,
        semu,
        suim,
        indicatorFlag,
        onClickStartButton
      }}
    />
  );
}

// import React from 'react';
// import { StatusBar, Platform, View } from 'react-native';

// import CreateScreenPresenter from './CreateScreenPresenter';
// import { ConferenceApi } from '../../services';
// import { MeetApi } from '../../services';
// import { NavigationEvents } from 'react-navigation';

// import DeviceInfo from 'react-native-device-info';
// import Orientation from 'react-native-orientation-locker';
// import { getT } from '../../utils/translateManager';

// const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

// class CreateScreenContainer extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       refreshing: false, // 리프레시 상태
//       searchKeyword: '', // 검색인풋
//       selectedRoomId: null,
//       selectedRoomName: null,
//       modal: false,
//       url: null,
//       orientation: 'UNKNOWN'
//     };
//     this.t = getT();
//   }

//   componentDidMount() {
//     Orientation.getOrientation(orientation => {
//       this.setState({ orientation });
//     });
//     Orientation.addOrientationListener(this._handleOrientation);
//   }

//   componentWillUnmount() {
//     Orientation.removeOrientationListener(this._handleOrientation);
//   }

//   render() {
//     const { searchKeyword } = this.state;
//     let wetalk = []; // We talk list
//     if (searchKeyword) {
//       wetalk = this.props.wetalk.filter(item =>
//         item.room_title.toLowerCase().includes(searchKeyword.toLowerCase())
//       );
//     } else {
//       wetalk = this.props.wetalk;
//     }
//     return (
//       <View style={{ flex: 1 }}>
//         <StatusBar barStyle="light-content" backgroundColor={'#1C90FB'} />
//         <NavigationEvents
//           onDidFocus={() => {
//             this._isFocus = true;
//           }}
//           onDidBlur={() => (this._isFocus = false)}
//         />
//         <CreateScreenPresenter
//           {...this.state}
//           list={wetalk}
//           onSearch={this._handleSearch}
//           onActivateModal={this._handleActivateModal}
//           onCreateConference={this._handleCreateConference}
//           onRefresh={this._handleRefresh}
//           orientation={this.state.orientation}
//           hasNotch={hasNotch}
//         />
//       </View>
//     );
//   } // render

//   _handleRefresh = () => {
//     this.props.navigation.state.params.onGetWetalkList();
//   };

//   _handleOrientation = orientation => {
//     this.setState({ orientation });
//   };

//   _handleRedirect = (url, param) => {
//     const { navigation } = this.props;
//     navigation.navigate('Home');
//     navigation.navigate(url, param);
//   };

//   _handleSearch = searchKeyword => {
//     this.setState({ searchKeyword });
//   };

//   _handleCreateConference = async (externalData = null) => {
//     let auth;
//     let company_code;
//     // 위하고에서 접속인지 아닌지 구분

//     const { selectedRoomId, selectedRoomName } = this.state;

//     auth = this.props.auth;
//     company_code = auth.employee_list.filter(
//       e => e.company_no == auth.last_access_company_no
//     )[0].company_code;
//     let createResult;

//     const bodyData = [
//       selectedRoomId, // 방 id
//       auth.portal_id, // 유저아이디
//       auth.user_name, // 유저이름
//       auth.last_access_company_no, // 회사번호
//       company_code, // 회사코드
//       auth.AUTH_A_TOKEN, // 토큰
//       auth.AUTH_R_TOKEN, // 토큰
//       auth.HASH_KEY
//       // null
//     ];

//     createResult = await ConferenceApi.create(...bodyData);
//     // 화상회의 생성가능여부 // 대화방 생성 or 참여 여부 결정
//     if (createResult.resultCode === 200) {
//       // 생성완료 메시지 보내기
//       const sendWetalkResult = await ConferenceApi.sendWetalk(
//         selectedRoomId,
//         createResult.resultData,
//         auth.last_access_company_no,
//         company_code,
//         auth.AUTH_A_TOKEN,
//         auth.AUTH_R_TOKEN,
//         auth.HASH_KEY
//       );
//       this.setState({ modal: false });

//       const videoRoomId = sendWetalkResult.resultData.chatList[0].mobile_key;

//       // 토큰받고
//       const roomToken = (await MeetApi.getMeetRoomToken(auth, videoRoomId))
//         .resultData;

//       let callType = 3;
//       let isCreator;

//       // 대화방에 참여한다.
//       this._handleRedirect('Setting', {
//         item: {
//           videoRoomId,
//           selectedRoomName,
//           roomType: 'meet',
//           roomToken,
//           callType,
//           isCreator
//         }
//       });
//     } else if (createResult.resultCode === 400) {
//       alert(createResult.resultMsg);
//       // 이미 화상채팅방이 생성되어 있습니다. 대화방당 1개의 화상채팅방을 제공합니다
//     } else if (createResult.errors && createResult.errors.code === 'E002') {
//       this._handleRefresh();
//     } else {
//       alert(this.t('alert_text_createfail'));
//     }
//   };

//   _handleActivateModal = (selectedRoomId = null, selectedRoomName = null) => {
//     this.setState(prev => ({
//       modal: !prev.modal,
//       selectedRoomId,
//       selectedRoomName
//     }));
//   };
// }

// export default CreateScreenContainer;
