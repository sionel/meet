import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';

import CreateScreenPresenter, { section } from './CreateScreenPresenter';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { WetalkApi, ConferenceApi, MeetApi } from '@services/index';
// import { ConferenceApi } from '@services/index';
// import { MeetApi } from '@services/index';

import {
  actionCreators as AlertActions,
  params as alertParam
} from '@redux/alert';

import { getT } from '@utils/translateManager';
import { wehagoDummyImageURL, wehagoMainURL } from '@utils/index';

import { MainNavigationProps } from '@navigations/MainStack';
import { isSuccess } from '@services/types';
import { useTranslation } from 'react-i18next';

export default function CreateScreenContainer(props: any) {
  // const initSection: section = {
  //   data: [],
  //   title: '',
  //   type: '',
  //   collapse: true,
  //   height: new Animated.Value(0),
  //   zIndex: 0
  // };
  const { t } = useTranslation();

  const [group, setGroup] = useState<any[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [semu, setSemu] = useState<any[]>([]);
  // const [suim, setSuim] = useState<section>(initSection);
  const [loaded, setLoaded] = useState(false);
  const [indicatorFlag, setIndicatorFlag] = useState(false);
  const [wetalkList, setWetalkList] = useState<any[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [searchList, setSearchList] = useState<any[]>([]);
  const [tabType, setTabType] = useState<'personal' | 'group' | 'semu'>(
    'group'
  );

  const { auth, alert } = useSelector((state: RootState) => {
    const { auth } = state.user;
    const { alert } = state;
    return {
      auth,
      alert
    };
  });

  const { navigation }: MainNavigationProps<'CreateConference'> = props;

  useEffect(() => {
    _getWetalkList();
  }, [alert]);
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


    // const suimList = customList.filter(
    //   (item: any) =>
    //     item.room_type === '5' &&
    //     item.is_video_access === 'F' &&
    //     !item.unpaid_status
    // );

    // const personalData: section = {
    //   data: personalList,
    //   title: `${t('create_room_oneonone')}(${personalList.length})`,
    //   type: 'personal',
    //   collapse: false,
    //   height: new Animated.Value(50 * personalList.length),
    //   zIndex: 1
    // };
    // const groupData: section = {
    //   data: groupList,
    //   title: `${t('create_room_group')}(${groupList.length})`,
    //   type: 'group',
    //   collapse: false,
    //   height: new Animated.Value(50 * groupList.length),
    //   zIndex: 2
    // };
    // const semuData: section = {
    //   data: semuList,
    //   title: `${t('create_room_semu')}(${semuList.length})`,
    //   type: 'semu',
    //   collapse: false,
    //   height: new Animated.Value(50 * semuList.length),
    //   zIndex: 3
    // };
    // const suimData: section = {
    //   data: suimList,
    //   title: `${t('create_room_suim')}(${suimList.length})`,
    //   type: 'suim',
    //   collapse: false,
    //   height: new Animated.Value(50 * suimList.length),
    //   zIndex: 4
    // };

    Promise.all([
      setPersonal(personalList),
      setGroup(groupList),
      setSemu(semuList)
      // setSuim(suimData)
    ]).then(() => {
      setLoaded(true);
    });
  }, [wetalkList, searchList]);

  const dispatch = useDispatch();
  const setAlert = (params: alertParam) =>
    dispatch(AlertActions.setAlert(params));

  const onClickBack = () => {
    navigation.goBack();
  };
  // const onClickHeader = (section: section) => {
  //   Animated.timing(section.height, {
  //     toValue: !section.collapse ? 0 : section.data.length * 50,
  //     useNativeDriver: false,
  //     duration: 400
  //   }).start();

  //   switch (section.type) {
  //     case 'personal':
  //       setPersonal({ ...section, collapse: !section.collapse });
  //       break;
  //     case 'group':
  //       setGroup({ ...section, collapse: !section.collapse });
  //       break;
  //     case 'semu':
  //       setSemu({ ...section, collapse: !section.collapse });
  //       break;
  //     case 'suim':
  //       setSuim({ ...section, collapse: !section.collapse });
  //       break;
  //     default:
  //       break;
  //   }
  // };
  const onClickStartButton = (conference: any) => {
    const message = t('alert_text_createroom');
    const onConfirm = () => {
      _createConferenceRoom(conference);
    };
    const title = t('alert_title_create');
    const type = 2;
    setAlert({ message, onConfirm, title, type });
  };
  const onRefresh = () => {
    _getWetalkList();
  };
  const onSearch = (key: string) => {
    setKeyword(key);
  };

  const _getWetalkList = async () => {
    let video_room_list: any[] = [];
    const getWetalkList = await WetalkApi.getWetalkList(auth);

    if (isSuccess(getWetalkList)) {
      video_room_list = getWetalkList.resultData.video_room_list;
    } else {
      //error
      video_room_list = [];
    }

    setWetalkList(video_room_list);
  };

  const _createConferenceRoom = async (conference: any) => {
    setIndicatorFlag(true);
    const { room_id, room_title: roomTitle } = conference;
    const { last_access_company_no, employee_list } = auth;

    const company_code = employee_list.filter(
      (e: any) => e.company_no == last_access_company_no
    )[0].company_code;

    const param = {
      service_code: 'communication',
      name: roomTitle,
      communication_id: room_id
    };

    const createResult = await MeetApi.createMeetRoom(auth, param);

    if (isSuccess(createResult)) {
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

      if (isSuccess(sendWetalkResult)) {
        const {
          mobile_key: videoRoomId,
          room_title,
          room_type,
          receiver_users
        } = sendWetalkResult.resultData.chatList[0];

        let receiverUserName = receiver_users[1]?.user_name;
        let selectedRoom = room_title ? room_title : receiverUserName;

        // 토큰받고
        // const roomToken = (await MeetApi.getMeetRoomToken(auth, videoRoomId))
        //   .resultData;

        setIndicatorFlag(false);
        //TODO: 화상대화 포인트이용해서 필요할경우 state
        navigation.navigate('SettingView', {
          accessType: 'auth',
          id: videoRoomId,
          selectedRoomName: selectedRoom
        });
      }
    } else {
      if (createResult.resultCode === 400) {
        setIndicatorFlag(false);

        const { resultMsg: message } = createResult;
        const title = t('renewal.alert_title_fail');
        const type = 1;
        setAlert({ message, title, type });

        // 이미 화상채팅방이 생성되어 있습니다. 대화방당 1개의 화상채팅방을 제공합니다
      } else if (createResult.errors && createResult.errors.code === 'E002') {
        setIndicatorFlag(false);
        const message = t('alert_text_failcreate');
        const title = t('renewal.alert_title_fail');
        const type = 1;
        setAlert({ message, title, type });
      } else {
        setIndicatorFlag(false);
        const message = t('alert_text_failcreate');
        const title = t('renewal.alert_title_fail');
        const type = 1;
        setAlert({ message, title, type });
      }
    }
  };

  const handleEditingSearching = () => {
    const wetalk = wetalkList.filter((item: any) =>
      item.room_title.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchList(wetalk);
  };

  return (
    <CreateScreenPresenter
      {...{
        searchList,
        loaded,
        onClickBack,
        // onClickHeader,
        onRefresh,
        onSearch,
        group,
        personal,
        semu,
        // suim,
        indicatorFlag,
        onClickStartButton,
        onEditingSearching: handleEditingSearching,
        keyword,
        setKeyword,
        tabType,
        setTabType
      }}
    />
  );
}
