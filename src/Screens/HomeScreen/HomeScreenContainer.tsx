import React, { Component, useEffect, useRef, useState } from 'react';
import {
  Platform,
  Linking,
  BackHandler,
  Alert,
  ToastAndroid,
  Share
} from 'react-native';

import { getT } from '../../utils/translateManager';

import { MeetApi, ServiceCheckApi, UserApi } from '../../services';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as RecentsActions } from '../../redux/modules/recentsInvited';
import { actionCreators as ConferenceActions } from '../../redux/modules/conference';
import { actionCreators as SelectCompanyActions } from '../../redux/modules/selectCompany';

import HomeScreenPresenter from './HomeScreenPresenter';
import HomeScreenHorizonPresenter from './HomeScreenHorizonPresenter';
import { content } from './Component/bottomPopup';
import { participantsListProps } from '../../components/renewal/ParticipantsList';
import { wehagoDummyImageURL, wehagoMainURL } from '../../utils';

import deviceInfoModule from 'react-native-device-info';

import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '../../Navigations/MainStack';
import RNrestart from 'react-native-restart';
import moment from 'moment';

const icUser = require('../../../assets/new/icons/ic_user.png');
const icModify = require('../../../assets/new/icons/ic_modify.png');
const icLink = require('../../../assets/new/icons/ic_link.png');
const icCancel = require('../../../assets/new/icons/ic_cancel.png');
const icInfo = require('../../../assets/new/icons/ic_info.png');
const icCheckB = require('../../../assets/new/icons/ic_check_b.png');

type conference = {
  room_id: string;
  name: string;
  portal_id: string;
  cno: number;
  is_public: boolean;
  connecting_user_count: any;
  register_user_count: any;
  connecting_user: any[];
  access_user: any[];
  created_at: any;
  start_date_time: any;
  end_date_time: any;
  r_start_date_time: any;
  r_end_date_time: any;
  communication_key: any;
  schedule_key: any;
  calendar_subject: any;
  calendar_color: any;
  calendar_no: any;
  is_started: boolean;
};

type userInfo = {
  full_path: string;
  is_master: boolean;
  profile_url: string;
  user: string;
  user_name: string;
  user_type: number;
};
interface emptyData {
  isEmpty: boolean;
}

export default function HomeScreenContainer(props: any) {
  const [test, setTest] = useState(false);
  const [indicator, setIndicator] = useState(true);
  const [ongoingConference, setOngoingConference] = useState<any[]>([]);
  const [reservationConference, setReservationConference] = useState<any[]>([]);
  const [finishedConference, setFinishedConference] = useState<any[]>([]);
  const [finishCount, setFinishCount] = useState(0);
  const [highlight, setHighlight] = useState<'reservation' | 'finished' | null>(
    null
  );
  const [finishIndex, setFinishIndex] = useState(0);
  const [finishDate, setFinishDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState(false);
  const [conferenceInterval, setConferenceInterval] =
    useState<NodeJS.Timeout>();
  const [bottomPopup, setBottomPopup] = useState<{
    show: boolean;
    contentList: content[];
    title: string;
    onClickOutside: () => void;
  }>({
    show: false,
    contentList: [],
    title: '',
    onClickOutside: () => {}
  });
  const [participantsList, setParticipantsList] = useState<
    participantsListProps & { show: boolean }
  >({
    onClose: () => {},
    participants: [],
    title: '',
    show: false
  });
  const ref = useRef<any>({
    reservationConference,
    exitApp: false,
    interval: null
  });

  const {
    auth,
    userImg,
    companyName,
    userName,
    portalId,
    selectedRoomId,
    isLogin,
    isHorizon
  } = useSelector((state: RootState) => {
    const { auth } = state.user;
    const { roomId } = state.conference;
    const { isHorizon } = state.orientation;
    return {
      auth: auth,
      userName: auth.user_name,
      portalId: auth.portal_id,
      isLogin: state.user.isLogin,
      userImg: auth.profile_url
        ? wehagoMainURL + auth.profile_url
        : wehagoDummyImageURL,
      companyName: auth?.last_company?.company_name_kr,
      selectedRoomId: roomId,
      isHorizon
    };
  });

  const dispatch = useDispatch();
  const _setRoomId = (id: string) => dispatch(ConferenceActions.setRoomId(id));

  const _handleLogout = () => {
    dispatch(UserActions.logout());
    dispatch(RecentsActions.resetRecents());
  };

  const { navigation }: MainNavigationProps<'MainStack'> = props;
  const t = getT();

  const _openCompany = () => dispatch(SelectCompanyActions.openCompany());
  const changeCompanyRequest = (auth: any, company: any) =>
    dispatch(UserActions.changeCompanyRequest(auth, company));

  const isTablet = deviceInfoModule.isTablet();
  const today = new Date();
  useEffect(() => {
    if (auth.cno !== undefined) {
      _getConferences();
      _getFinishedConferences();
    }
    BackHandler.addEventListener('hardwareBackPress', _handleBackButton);

    // const reload = setInterval(() => {
    //   _getConferences();
    // }, 15000);

    // ref.current.interval = reload;
    // setConferenceInterval(reload);
    return () => {
      clearTimeout(ref.current.time);
      // clearInterval(ref.current.interval);
      BackHandler.removeEventListener('hardwareBackPress', _handleBackButton);
    };
  }, []);

  useEffect(() => {
    const now = !reservationConference.length
      ? 'finished'
      : !finishedConference.length
      ? 'reservation'
      : highlight;

    highlight !== now && setHighlight(now);
    ref.current.reservationConference = reservationConference;
    ref.current.finishedConference = finishedConference;
  }, [reservationConference, finishedConference]);

  useEffect(() => {
    console.log('finishIndex : ', finishIndex);
        
    if (auth.cno !== undefined) {
      _getFinishedConferences();
    }
  }, [finishDate, finishIndex]);

  const _handleBackButton = () => {
    // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (!ref.current.exitApp) {
      ToastAndroid.show(
        t('renewal.toast_one_more_click_exit'),
        ToastAndroid.SHORT
      );
      ref.current.exitApp = true;
      ref.current.timeout = setTimeout(() => {
        ref.current.exitApp = false;
      }, 1000);
    } else {
      clearTimeout(ref.current.timeout);
      BackHandler.exitApp(); // 앱 종료
    }
    return true;
  };
  const _getFinishDate = () => {
    const tmpDate = new Date(finishDate);
    const startDate = new Date(tmpDate.setDate(1));
    const endDate = new Date(tmpDate.setMonth(tmpDate.getMonth() + 1));

    const startDateString = `${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()}`;
    const endDateString = `${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()}`;

    return { startDateString, endDateString };
  };
  const _getFinishedConferences = () => {
    const { startDateString, endDateString } = _getFinishDate();
    MeetApi.getMeetFinished(
      auth,
      startDateString,
      endDateString,
      finishIndex,
      15
    ).then(async result => {
      setFinishCount(result.total);
      const finished = result.list;
      console.log('finished : ', finished);
      
      const conference = await Promise.all(
        finished.map(async (conference: any) => {
          const year = new Date(conference.start_date_time).getFullYear();
          const month = new Date(conference.start_date_time).getMonth() + 1;
          const day = new Date(conference.start_date_time)
            .getDate()
            .toString()
            .padStart(2, '0');
          const dateString = `${year}.${month}.${day}`;
          const ampmStart =
            parseInt(
              new Date(conference.start_date_time).toTimeString().slice(0, 2)
            ) < 12
              ? 'AM'
              : 'PM';
          const startTimeString = new Date(conference.start_date_time)
            .toTimeString()
            .slice(0, 5);
          const ampmEnd =
            parseInt(
              new Date(conference.end_date_time).toTimeString().slice(0, 2)
            ) < 12
              ? 'AM'
              : 'PM';
          const endTimeString = new Date(conference.end_date_time)
            .toTimeString()
            .slice(0, 5);
          const timeString = `${dateString}\n${startTimeString}${ampmStart} ~ ${endTimeString}${ampmEnd}`;
          const { hour, minutes } = conference.usage_time;
          const usageTime = hour * 60 + minutes;

          const accessedUser: any[] = await MeetApi.getFinishedParticipant(
            auth,
            conference.t_room_id
          );

          const sortedConnectedUserList = accessedUser.sort(
            (user: any, _user: any) => _user.is_master - user.is_master
          );

          // console.log('sortedConnectedUserList : ', sortedConnectedUserList);

          // const portalIdList = sortedConnectedUserList
          //   .map((user: any) => user.user)
          //   .filter((user: any) => user);

          // console.log('portalIdList : ', portalIdList);

          // const sortedPortalIdList: any[] = portalIdList.map((id: string) => {
          //   const item = sortedConnectedUserList.find(
          //     (e: userInfo) => e.user === id
          //   );
          //   return item;
          // });

          // console.log('accessedUser : ', accessedUser);

          // const users = conference.users;
          // console.log('users : ', users);

          // const portalIdList = users
          //   .map((user: any) => user.user)
          //   .filter((user: any) => user);

          //TODO: 다음주화요일에 room/connected-user api 수정되면 삭제하고 accessedUser 에서 값받아서 처리
          // const participants: any[] = await MeetApi.getUserInfoList(
          //   auth,
          //   portalIdList
          // );

          // const newParticipants = participants.filter(
          //   user => user.is_primary === 'T'
          // );

          // newParticipants.push(...users.filter((e: any) => e.user_type === 2));

          const uriList = sortedConnectedUserList.reduce<
            { type: string; value: string | number }[]
          >((prev, present) => {
            if (prev.length > 2) return prev;
            // console.log('present : ', present);
            
            let type;
            let value;
            const isMaster = present.is_master;
            const uri = present?.profile_url
              ? wehagoMainURL + present.profile_url
              : wehagoDummyImageURL;

            if (sortedConnectedUserList.length <= 3) {
              type = 'string';
              value = uri;
            } else {
              type = prev.length < 2 ? 'string' : 'number';
              value = prev.length < 2 ? uri : sortedConnectedUserList.length - 2;
            }

            return [...prev, { type, value, isMaster }];
          }, []);

          const roomId = conference.t_room_id;
          const data = {
            conferenceName: conference.name,
            timeString,
            usageTime,
            users: uriList,
            roomId,
            finishedMoreClick: () => _finishedMoreClick(conference)
          };

          return data;
        })
      );

      if (ref.current.finishedConference.length === 0 && conference.length > 0)
        setHighlight('finished');

      setFinishedConference([...finishedConference, ...conference]);
      // setFinishedConference([]);
    });
  };

  const _getConferences = () => {
    MeetApi.getMeetRoomsList(auth)
      .then(async result => {
        const going: conference[] = result.filter(
          (conference: conference) => conference.is_started
        );

        const goingList = await Promise.all(
          going.map(async conference => {
            const startTime = new Date(
              conference.start_date_time
                ? conference.start_date_time
                : conference.created_at
            ).toTimeString();

            const ampm = parseInt(startTime.slice(0, 2)) < 12 ? 'AM' : 'PM';
            const time = ampm + ' ' + startTime.slice(0, 5);

            const onMinte = Math.floor(
              (new Date().getTime() -
                (conference.start_date_time
                  ? conference.start_date_time
                  : conference.created_at)) /
                1000 /
                60
            );

            const connectingUser = await MeetApi.getUserList(
              auth,
              conference.room_id
            );

            const isMaster = connectingUser.filter(
              (user: any) => user.user === portalId
            )[0]?.is_master
              ? true
              : false;
            //진행중인 방에서는 내가 없을수 있으므로 ?를 붙임
            const sortedConnectingUserList = connectingUser.sort(
              (user: any, _user: any) => _user.is_master - user.is_master
            );

            const portalIdList = sortedConnectingUserList
              .map((user: any) => user.user)
              .filter((user: any) => user);

            //TODO: 다음주화요일에 room/connected-user api 수정되면 삭제하고 accessedUser 에서 값받아서 처리
            // const participants: any[] = await MeetApi.getUserInfoList(
            //   auth,
            //   portalIdList
            // );

            const sortedPortalIdList: any[] = portalIdList.map((id: string) => {
              const item = sortedConnectingUserList.find(
                (e: userInfo) => e.user === id
              );
              return item;
            });

            const uriList = sortedPortalIdList.reduce<
              { type: string; value: string | number }[]
            >((prev, present) => {
              if (prev.length > 4) return prev;
              let type;
              let value;
              const isMaster = present?.is_master;
              const uri = present?.profile_url
                ? wehagoMainURL + present.profile_url
                : wehagoDummyImageURL;
              if (sortedPortalIdList.length <= 5) {
                type = 'string';
                value = uri;
              } else {
                type = prev.length < 4 ? 'string' : 'number';
                value = prev.length < 4 ? uri : sortedPortalIdList.length - 4;
              }

              return [...prev, { type, value, isMaster }];
            }, []);

            const data = {
              conferenceName: conference.name,
              time,
              onMinte,
              participants: uriList,
              isLock: !conference.is_public,
              goingMoreClick: () => _goingMoreClick(conference, isMaster),
              enterConference: () =>
                navigation.navigate('ConferenceStateView', {
                  id: conference.room_id,
                  from: 'meet',
                  accessType: 'auth',
                  selectedRoomName: conference.name
                })
              // _handleRedirect('ConferenceState', {
              //   id: conference.room_id,
              //   item: {
              //     roomId: conference.room_id,
              //     externalData: null,
              //     from: 'meet'
              //   }
              // })
            };
            return data;
          })
        );
        setOngoingConference(goingList);
        // setOngoingConference([]);

        // =====================================================================================================
        // =====================================================================================================
        // =====================================================================================================

        const reservation: conference[] = result.filter(
          (conference: conference) => !conference.is_started
        );
        const reservationList = await Promise.all(
          reservation.map(async conference => {
            const accessUser = await MeetApi.getAccessUsers(
              auth,
              conference.room_id
            );

            const isMaster = accessUser.filter(
              (user: any) => user.user === portalId
            )[0]?.is_master
              ? true
              : false;

            const sortedAccessUserList: any[] = accessUser.sort(
              (user: any, _user: any) => _user.is_master - user.is_master
            );

            // console.log('sortedAccessUserList : ', sortedAccessUserList);

            const portalIdList = sortedAccessUserList
              .map((user: any) => user.user)
              .filter((user: any) => user);

            // console.log('portalIdList : ', portalIdList);

            //TODO: 다음주화요일에 room/connected-user api 수정되면 삭제하고 accessedUser 에서 값받아서 처리
            // const participants: any[] = await MeetApi.getUserInfoList(
            //   auth,
            //   portalIdList
            // );

            // const newParticipants = participants.filter(user => user.is_primary === 'T');
            //

            const sortedPortalIdList: any[] = portalIdList.map((id: any) => {
              const item =
                // newParticipants.find(e => e.portal_id === id) ||
                sortedAccessUserList.find(e => e.user === id);
              return item;
            });

            const uriList = sortedPortalIdList.reduce<
              { type: string; value: string | number }[]
            >((prev, present) => {
              if (prev.length > 2) return prev;
              let type;
              let value;
              let isMaster = present?.isMaster;
              const uri = present?.profile_url
                ? wehagoMainURL + present.profile_url
                : wehagoDummyImageURL;
              if (sortedPortalIdList.length <= 3) {
                type = 'string';
                value = uri;
              } else {
                type = prev.length < 2 ? 'string' : 'number';
                value = prev.length < 2 ? uri : sortedPortalIdList.length - 2;
              }
              return [...prev, { type, value, isMaster }];
            }, []);

            const start = new Date(conference.r_start_date_time).toTimeString();
            const sAmPm = parseInt(start.slice(0, 2)) < 12 ? 'AM' : 'PM';
            const startTime = sAmPm + ' ' + start.slice(0, 5);

            const end = new Date(conference.r_end_date_time).toTimeString();
            const eAaPm = parseInt(end.slice(0, 2)) < 12 ? 'AM' : 'PM';
            const endTime = eAaPm + ' ' + end.slice(0, 5);

            const data = {
              roomName: conference.name,
              date: new Date(conference.r_start_date_time).toLocaleDateString(),
              start: startTime,
              end: endTime,
              users: uriList,
              roomId: conference.room_id,
              isPublic: conference.is_public,
              reservationMoreClick: (roomId: string) =>
                _reservationMoreClick(conference, isMaster, roomId)
            };
            return data;
          })
        );

        if (
          ref.current.reservationConference.length === 0 &&
          reservationList.length > 0
        )
          setHighlight('reservation');

        setReservationConference(reservationList);
        // setReservationConference([]);
      })
      .then(() => {
        const time = setTimeout(() => {
          _getConferences();
        }, 15000);
        ref.current.time = time;
      });
  };

  const _goingMoreClick = (conference: conference, isMaster: boolean) => {
    const list = {
      name: t('renewal.main_participants'),
      icon1: icUser,
      onClick: () => {
        openParticipantsList('going', conference);
      }
    };
    const copy = {
      name: t('renewal.main_sharelink_copy'),
      icon1: icLink,
      onClick: () => {}
    };
    setBottomPopup({
      onClickOutside: _onClickOutside,
      contentList: [list, copy],
      show: true,
      title: conference.name
    });
  };

  const _reservationMoreClick = (
    conference: conference,
    isMaster: boolean,
    roomId: string
  ) => {
    _setRoomId(roomId);

    const list = {
      name: t('renewal.main_reservation_participants'),
      icon1: icUser,
      onClick: () => {
        openParticipantsList('reservation', conference);
      }
    };
    const modify = {
      name: t('renewal.main_reservation_info'),
      icon1: icModify,
      onClick: () => {
        conferenceModify();
      }
    };
    const copy = {
      name: t('renewal.main_sharelink_copy'),
      icon1: icLink,
      onClick: () => {
        Share.share({
          title: t('renewal.main_sharelink_copy'),
          message: `https://video.wehago.com/video?room=${conference.room_id}`
          // url: `https://video.wehago.com/video?room=${conference.room_id}`
        });
      }
    };
    const cancle = {
      name: t('renewal.main_reservation_cancel'),
      icon1: icCancel,
      onClick: async () => {
        const result = await MeetApi.deleteConferenceRoom(
          auth,
          conference.room_id
        );

        if (result) {
          setBottomPopup({
            show: false,
            contentList: [],
            title: '',
            onClickOutside: _onClickOutside
          });
          _getConferences();
        } else {
          console.log('예약 취소중에 오류가 발생했습니다.');
        }
      }
    };

    const contentList = [];

    contentList.push(list);
    contentList.push(modify);
    contentList.push(copy);

    isMaster && contentList.push(cancle);
    setBottomPopup({
      onClickOutside: _onClickOutside,
      contentList,
      show: true,
      title: conference.name
    });
  };

  const _finishedMoreClick = (conference: any) => {
    const list = {
      name: t('renewal.main_participants'),
      icon1: icUser,
      onClick: () => {
        openParticipantsList('finished', conference);
      }
    };
    const contentList = [];

    contentList.push(list);

    setBottomPopup({
      onClickOutside: _onClickOutside,
      contentList,
      show: true,
      title: conference.name
    });
  };

  const openParticipantsList = async (
    type: 'going' | 'reservation' | 'finished',
    conference: conference & any
  ) => {
    let users;
    let title;
    let participants: { image: any; name: any; status: any }[] = [];
    if (type === 'going') {
      title = t('renewal.main_now_participants');
      const participantInfoList: any[] = await MeetApi.getUserList(
        auth,
        conference.room_id
      );

      participants = participantInfoList
        .map(participant => ({
          image: participant?.profile_url
            ? wehagoMainURL + participant.profile_url
            : wehagoDummyImageURL,
          name: participant.user_name,
          status: participant?.is_master
            ? 'master'
            : participant.user_type === 2
            ? 'extra'
            : 'normal'
        }))
        .sort(a => {
          return a.status === 'master' ? -1 : 1;
        });
    } else if (type === 'reservation') {
      const accessUser: any[] = await MeetApi.getAccessUsers(
        auth,
        conference.room_id
      );

      participants = accessUser
        .map(participant => ({
          image: participant?.profile_url
            ? wehagoMainURL + participant.profile_url
            : wehagoDummyImageURL,
          name: participant.user_name,
          status: participant.is_master
            ? 'master'
            : participant.user_type === 2
            ? 'extra'
            : 'normal'
        }))
        .sort(a => {
          return a.status === 'master' ? -1 : 1;
        });
      users = conference.connecting_user;
      title = t('renewal.main_excepted_participants');
    } else {
      const accessedUser: any[] = await MeetApi.getFinishedParticipant(
        auth,
        conference.t_room_id
      );

      // console.log('accessedUser : ', accessedUser);

      const portalIdList = accessedUser
        .map((user: any) => user.user)
        .filter((user: any) => user);

      // console.log('portalIdList : ', portalIdList);

      //TODO: 다음주화요일에 room/connected-user api 수정되면 삭제하고 accessedUser 에서 값받아서 처리
      const participantInfoList: any[] = await MeetApi.getUserInfoList(
        auth,
        portalIdList
      );

      // console.log('participantInfoList : ', participantInfoList);

      const extraUser = accessedUser
        .filter((e: any) => e.user_type === 2)
        .map(({ username, user_type }) => ({
          user_type,
          user_name: username
        }));

      const newPartipantInfoList = participantInfoList.filter(
        user => user.is_primary === 'T'
      );
      newPartipantInfoList.push(...extraUser);

      participants = newPartipantInfoList
        .map(participant => ({
          image: participant?.profile_url
            ? wehagoMainURL + participant.profile_url
            : wehagoDummyImageURL,
          name: participant.user_name,
          status: participant.is_master
            ? 'master'
            : participant.user_type === 2
            ? 'extra'
            : 'normal'
        }))
        .sort(a => {
          return a.status === 'master' ? -1 : 1;
        });
      users = conference.connecting_user;
      title = t('renewal.main_attend_count');
    }

    const onClose = () => {
      setParticipantsList({
        ...participantsList,
        show: false
      });
    };

    setParticipantsList({
      title,
      onClose,
      show: true,
      participants
    });
  };

  const _onClickOutside = () => {
    setBottomPopup({
      ...bottomPopup,
      show: false
    });
  };

  const createConference = () => {
    // navigation.navigate('DirectCreateConference');

    const chat = {
      name: t('renewal.main_create_messenger'),
      // icon1: icUser,
      onClick: () => {
        navigation.navigate('CreateConference');
      }
    };
    const meet = {
      name: t('renewal.main_create_direct_input'),
      // icon1: icLink,
      onClick: () => {
        navigation.navigate('DirectCreateConference');
      }
    };
    setBottomPopup({
      onClickOutside: _onClickOutside,
      contentList: [chat, meet],
      show: true,
      title: t('renewal.main_create_videoconference')
    });
  };

  const enterInviteCode = () => {
    navigation.navigate('InviteCode');
  };

  const conferenceModify = () => {
    navigation.navigate('ModifyConference');
  };

  const createTalkConference = () => {
    navigation.navigate('CreateConference');
  };

  // const createConference = () => {

  // }

  const handleConpanyChange = () => {
    _openCompany();
  };

  const handleClickSetting = () => {
    navigation.navigate('ConfigurationStack');
  };
  const handleChangeMonth = (date: moment.Moment) => {
    setFinishedConference([]);
    setFinishIndex(0);
    setFinishDate(date.toDate());
    setCalendarView(false);
  };
  const handleEndReached = () => {
    setFinishIndex(finishIndex + 10);
  };

  const presenterProps = {
    isTablet,
    userName,
    indicator,
    ongoingConference,
    reservationConference,
    finishedConference,
    highlight,
    setHighlight,
    userImg,
    companyName,
    bottomPopup,
    participantsList,
    createTalkConference,
    test,
    createConference,
    isHorizon,
    enterInviteCode,
    onConpanyChange: handleConpanyChange,
    onChangeMonth: handleChangeMonth,
    setCalendarView,
    calendarView,
    finishDate,
    onEndReached: handleEndReached,
    finishCount,
    onClickSetting: handleClickSetting
  };
  return isHorizon ? (
    <HomeScreenHorizonPresenter {...presenterProps} />
  ) : (
    <HomeScreenPresenter {...presenterProps} />
  );
}

// import React, { Component } from 'react';
// import {
//   AppState,
//   StatusBar,
//   Linking,
//   Platform,
//   View,
//   ToastAndroid,
//   BackHandler
// } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
// import Orientation from 'react-native-orientation-locker';
// import { NavigationEvents } from 'react-navigation';

// import HomeScreenPresenter from './HomeScreenPresenter';

// // service
// import { WetalkApi, MeetApi, ServiceCheckApi, UserApi } from '../../services';
// import { querystringParser, isWehagoV } from '../../utils';

// import { getT } from '../../utils/translateManager';
// const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

// class HomeScreenContainer extends Component {
//   constructor(props) {
//     super(props);
//     this._isFocus = true;
//     this._refreshTimeStamp = Date.now();
//     this.t = getT();
//   }

//   state = {
//     appState: AppState.currentState,
//     refreshing: false, // 리프레시 상태
//     searchKeyword: '', // 검색인풋
//     selectedRoomId: null,
//     selectedRoomName: null,
//     // modal: false,
//     url: null,
//     orientation: 'UNKNOWN',
//     alert: {
//       visible: false,
//       title: '',
//       message: '',
//       onClose: () => {}
//     },
//     room_id: null
//   };

//   async componentDidMount() {
//     this._getServices();
//     // 화면 회전 처리
//     Orientation.getOrientation(orientation => {
//       this.setState({ orientation });
//     });
//     Orientation.addOrientationListener(this._handleOrientation);
//     // 개인 회원 여부 체크
//     // 0: 일반, 1: 개인
//     if (this.props.auth.member_type !== 1) {
//       // 주기적으로 앱 업데이트
//       AppState.addEventListener('change', this._handleAppStateChange);
//       this._interval = setInterval(() => {
//         if (Date.now() > this._refreshTimeStamp + 3000) {
//           // 리프레쉬 할 시간이 지났으면 리프레쉬 한다.
//           this._handleRefresh();
//         }
//       }, 15000);
//     }

//     // 뒤로가기 버튼 동작
//     BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
//   }

//   // shouldComponentUpdate = (nextProps, nextState) => {
//     // [android] 앱이 실행중에 딥링크에 의한 화상회의 연결방법
//     // if (
//     //   // Platform.OS === 'android' &&
//     //   this.props.screenProps !== nextProps.screenProps
//     // ) {
//     //   this._handleOpenURL(nextProps.screenProps);
//     // }

//     // return true;
//   // };

//   componentWillUnmount() {
//     clearInterval(this._interval);
//     clearTimeout(this.refresh);
//     Orientation.removeOrientationListener(this._handleOrientation);
//     // Linking.removeEventListener('url', this._handleOpenURL);
//     AppState.removeEventListener('change', this._handleAppStateChange);

//     // 앱 종료를 막음
//     this.exitApp = false;
//     BackHandler.removeEventListener(
//       'hardwareBackPress',
//       this._handleBackButton
//     );
//   }

//   render() {
//     const { refreshing, selectedRoomId, orientation, alert } = this.state;
//     const { navigation, auth ,setVideoId} = this.props;
//     const plan = auth?.last_company?.membership_code; // 요금제 [WE: 엣지, SP: 싱글팩, ...]

//     let conferenceList = this.props.conference;

//     let started = [];
//     let reservation = [];

//     if (conferenceList.length > 0) {
//       started = conferenceList.filter(i => i.is_started);
//       reservation = conferenceList.filter(i => !i.is_started);
//     }

//     const hideStatusbar =
//       orientation === 'LANDSCAPE' ||
//       orientation === 'LANDSCAPE-LEFT' ||
//       orientation === 'LANDSCAPE-RIGHT';

//     return (
//       <View style={{ flex: 1 }}>
//         <StatusBar
//           barStyle="light-content"
//           backgroundColor={'#1C90FB'}
//           hidden={hideStatusbar}
//         />
//         <NavigationEvents
//           onDidFocus={() => {
//             this._isFocus = true;
//             this._handleRefressAfterWhile();
//           }}
//           onDidBlur={() => (this._isFocus = false)}
//         />
//         <HomeScreenPresenter
//           plan={plan}
//           navigation={navigation}
//           refreshing={refreshing}
//           permission={this.props.permission}
//           started={started}
//           reservation={reservation}
//           auth={auth}
//           selectedRoomId={selectedRoomId}
//           alert={alert}
//           memberType={auth.member_type}
//           onRedirect={this._handleRedirect}
//           onRefresh={this._handleRefresh}
//           onSearch={this._handleSearch}
//           onGetWetalkList={this._handleGetWetalkList}
//           orientation={this.state.orientation}
//           setVideoId={setVideoId}
//           hasNotch={hasNotch}
//         />
//       </View>
//     );
//   }

//   _getServices = async () => {
//     const { auth, setDeployedServices } = this.props;

//     const neors = await ServiceCheckApi.anotherServiceCheck(
//       auth,
//       auth.last_company,
//       'neors'
//     );
//     const wedrive = await ServiceCheckApi.anotherServiceCheck(
//       auth,
//       auth.last_company,
//       'wedrive'
//     );
//     const attendance = await ServiceCheckApi.anotherServiceCheck(
//       auth,
//       auth.last_company,
//       'attendance'
//     );
//     const eapprovals = await ServiceCheckApi.anotherServiceCheck(
//       auth,
//       auth.last_company,
//       'eapprovals'
//     );
//     const isDeployedServices = ['wehago'];
//     neors && isDeployedServices.push('neors');
//     wedrive && isDeployedServices.push('wedrive');
//     attendance && isDeployedServices.push('attendance');
//     eapprovals && isDeployedServices.push('eapprovals');
//     setDeployedServices(isDeployedServices);
//     // this.setState({ isDeployedServices, ...this.state });
//   };

//   _handleBackButton = () => {
//     // if(this.props.navigation)
//     if (!this.props.navigation.isFocused()) return false;

//     this.props.navigation.closeDrawer();

//     // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
//     if (this.exitApp == undefined || !this.exitApp) {
//       ToastAndroid.show(this.t('renewal.toast_closeapp'), ToastAndroid.SHORT);
//       this.exitApp = true;

//       this.timeout = setTimeout(() => {
//         this.exitApp = false;
//       }, 1000);
//     } else {
//       clearTimeout(this.timeout);

//       BackHandler.exitApp(); // 앱 종료
//     }
//     return true;
//   };

//   _handleOrientation = orientation => {
//     this.setState({ orientation });
//   };

//   _handleOpenURL = event => {
//     this._handleOpenLink(event.conferenceCall || event.url);
//   };

//   _handleOpenLink = url => {
//     if (!url) return;
//     let result;
//     // 로그인이 되어있을 때 연결 요청이 왔을 시 url: string
//     // 비로그인상태에서 연결 요청후 위하고 앱으로 로그인을 진행하면 url: object
//     if (typeof url === 'string') result = querystringParser(url);
//     else result = url;
//     // 로그인 요청 시간 체크
//     if (result.timestamp) {
//       const timestamp_now = Date.now();
//       // 오래된(15초 이상) 연결요청의 경우 무시
//       if (timestamp_now - result.timestamp > 15000) return;
//     }

//     // console.warn('RESULT :: ', result);
//     if (result.is_creater) {
//       // 화상회의 실행
//       if (this.state.room_id === result.room_id) return;
//       // console.warn(url);
//       this.setState({ room_id: result.room_id }, () => {
//         this._handleCheckConference(result.room_id, result);
//       });
//     } else if (result.show === 'T') {
//       // 모바일 웹 메신저에서 접근하게 되면 여기로 옴
//       this._handleRedirect('ConferenceState', {
//         item: {
//           roomId: result.video_id,
//           externalData: null,
//           from: 'meet'
//         }
//       });
//     } else {
//       if (result.message) alert(result.message);
//       return;
//     }
//   };

//   _handleRedirect = (url, param) => {
//     const { navigation } = this.props;
//     navigation.navigate(url, param);
//   };

//   _handleSearch = searchKeyword => {
//     this.setState({ searchKeyword });
//   };

//   _handleRefressAfterWhile = () => {
//     this.refresh = setTimeout(this._handleRefresh, 250);
//   };

//   _handleRefresh = () => {
//     // if (AppState.currentState === 'active' && this._isFocus) {
//     //   this._refreshTimeStamp = Date.now();
//     //   this.setState({ refreshing: true });
//     //   this._handleAutoLogin();
//     // }
//   };

//   _handleGetWetalkList = async () => {
//     const { auth, onSetWetalkList, onSetConferenceList } = this.props;
//     // 메신저조회 API

//     // 위톡방 기준 create 할때를 위해 위톡방 리스트를 가져 올 필요가 있음 그래서 살려둔 api
//     const wetalkList = await WetalkApi.getWetalkList(
//       auth.AUTH_A_TOKEN,
//       auth.AUTH_R_TOKEN,
//       auth.last_access_company_no,
//       auth.portal_id,
//       auth.HASH_KEY
//     );
//     onSetWetalkList(
//       wetalkList.resultData.video_room_list.sort((a, b) =>
//         a.send_timestamp < b.send_timestamp ? 1 : -1
//       )
//     );

//     if (wetalkList.errors) {
//       return this._handleAutoLogin();
//     }
//     // 실제 받아오는 화상회의 리스트
//     const cl = await MeetApi.getMeetRoomsList(
//       auth.AUTH_A_TOKEN,
//       auth.AUTH_R_TOKEN,
//       auth.last_access_company_no,
//       auth.portal_id,
//       auth.HASH_KEY
//     );
//     // 토큰만료시
//     if (cl) {
//       onSetConferenceList(
//         cl.resultData.sort((a, b) =>
//           a.start_date_time < b.start_date_time ? 1 : -1
//         )
//       );
//     }

//     this.setState({ refreshing: false });
//   };

//   _handleAutoLogin = async (count = 0) => {
//     const { auth } = this.props;
//     // 접속자 확인
//     const checkResult = await this._loginCheckRequest(
//       auth.AUTH_A_TOKEN,
//       auth.AUTH_R_TOKEN,
//       auth.last_access_company_no,
//       auth.HASH_KEY,
//       this.props.from
//     );
//     // 재 로그인

//     if (checkResult.errors) {
//       if (checkResult.errors.code === 'E002') {
//         this.props.setAlert({
//           type: 1,
//           title: this.t('renewal.alert_title_login_fail'),
//           message: this.t('renewal.alert_text_duplicate_logout')
//         });
//         this.props.sessionCheck(false);
//       } else {
//         this.props.onDisconnect();
//       }
//       this.props.setDestination('Login');
//       this.props.onLogout();
//     } else {
//       this._handleGetWetalkList();
//     }
//   };

//   _loginCheckRequest = async (
//     AUTH_A_TOKEN,
//     AUTH_R_TOKEN,
//     cno,
//     HASH_KEY,
//     from
//   ) => {
//     const checkResult = await UserApi.check(
//       AUTH_A_TOKEN,
//       AUTH_R_TOKEN,
//       cno,
//       HASH_KEY
//     );

//     if (checkResult.resultCode === 200) {
//       const {autoLogin} = this.props;
//       const userData = {
//         // login api data
//         AUTH_A_TOKEN,
//         AUTH_R_TOKEN,
//         HASH_KEY,
//         cno,
//         // check api data
//         user_no: checkResult.resultData.user_no,
//         portal_id: checkResult.resultData.portal_id, // 아이디
//         user_name: checkResult.resultData.user_name,
//         user_default_email: checkResult.resultData.user_default_email,
//         user_email: checkResult.resultData.user_email,
//         profile_url: checkResult.resultData.profile_url,
//         user_contact: checkResult.resultData.user_contact,
//         employee_list: checkResult.resultData.employee_list, // 회사정보
//         last_access_company_no: checkResult.resultData.last_access_company_no
//           ? checkResult.resultData.last_access_company_no
//           : cno,
//         last_company: checkResult.resultData.last_access_company_no
//           ? checkResult.resultData.employee_list.filter(
//               e => e.company_no == checkResult.resultData.last_access_company_no
//             )[0]
//           : checkResult.resultData.employee_list[0], // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
//         member_type: checkResult.resultData.member_type, // 0: 일반회원, 1: 개인회원
//         nickname: checkResult.nickname,
//         membership_code: checkResult.resultData.employee_list[0].membership_code
//       };
//       this.props.login(userData, from, autoLogin);
//       return checkResult;
//     } else {
//       const result = checkResult.errors ? checkResult : { errors: checkResult };
//       this.props.eventLog(result);
//       return result;
//     }
//   };

//   _handleCheckConference = async (
//     // 외부 (위하고 앱) 에서 접근할때 만 여기로 오게 됨
//     conferenceId,
//     externalData = null,
//     selectedRoomName = null,
//     from
//   ) => {
//     let { auth } = this.props;
//     let callType = 3;
//     let isCreator;
//     // 위하고(외부)에서 접속인지 아닌지 구분
//     auth = {
//       ...auth,
//       conferenceId,
//       portal_id: externalData.owner_id,
//       user_name: externalData.owner_name,
//       last_access_company_no: externalData.cno,
//       AUTH_A_TOKEN: externalData.access
//     };

//     callType = externalData.call_type; // 1:화상 / 2:음성
//     isCreator = externalData.is_creater; // 0:생성자 / 1:참여자 / 9:비즈박스알파

//     this._handleRedirect('Conference', {
//       item: {
//         videoRoomId: conferenceId,
//         callType,
//         isCreator
//       }
//     });
//   };

//   _handleModalChange = (
//     visible = false,
//     title = '',
//     message = '',
//     onClose = () => {}
//   ) => {
//     this.setState({
//       alert: {
//         visible,
//         title,
//         message,
//         onClose
//       }
//     });
//   };

//   _handleAppStateChange = nextAppState => {
//     if (
//       this.state.appState.match(/inactive|background/) &&
//       nextAppState === 'active'
//     ) {
//       this._handleRefressAfterWhile();
//     }
//     this.setState({ appState: nextAppState });
//   };
// }

// export default HomeScreenContainer;
//
