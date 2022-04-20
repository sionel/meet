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
    // console.log('finishDate : ', finishDate);
    // console.log('finishIndex : ', finishIndex);

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
    const endDate = new Date(tmpDate.getFullYear(), tmpDate.getMonth() + 1, 0);

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
      20
    ).then(async result => {
      setFinishCount(result.total);
      const finished = result.list;

      if (finished.length === 0) {
        return;
      }

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
              value =
                prev.length < 2 ? uri : sortedConnectedUserList.length - 2;
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

            const portalIdList = sortedAccessUserList
              .map((user: any) => user.user)
              .filter((user: any) => user);

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
              let isMaster = present?.is_master;
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
      onClick: () => {
        Share.share({
          title: t('renewal.main_sharelink_copy'),
          message: `https://video.wehago.com/video?room=${conference.room_id}`
        });
      }
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

      // const portalIdList = accessedUser
      //   .map((user: any) => user.user)
      //   .filter((user: any) => user);

      // const participantInfoList: any[] = await MeetApi.getUserInfoList(
      //   auth,
      //   portalIdList
      // );

      const extraUser = accessedUser
        .filter((e: any) => e.user_type === 2)
        .map(({ username, user_type }) => ({
          user_type,
          user_name: username,
          profile_url: undefined,
          is_master: false
        }));

      const newPartipantInfoList = accessedUser
        .filter((e: any) => e.user_type === 1)
        .map(({ username, user_type, profile_url, is_master }) => ({
          user_type,
          user_name: username,
          profile_url,
          is_master
        }));
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
    setFinishIndex(finishIndex + 20);
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
