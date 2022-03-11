import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SettingScreenPresenter from './SettingScreenPresenter';
import JitsiMeetJS from '../../../jitsi/features/base/lib-jitsi-meet';
import config from '../../utils/conference/config';
import { v4 as uuidv4 } from 'uuid';
import { getT } from '../../utils/translateManager';

import { actionCreators as AlertAcions } from '../../redux/modules/alert';
import { actionCreators as LocalActions } from '../../redux/modules/local';
import { RootState } from '../../redux/configureStore';
import { MeetNavigationProps } from '../../Navigations/RootNavigation';

import { MeetApi } from '../../services';

export default function SettingScreenContainer(props: any) {
  const [name, setName] = useState('');
  const [tracks, setTracks] = useState<any[] | null>([]);
  const [nameField, setNameField] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  // const ref = useRef<any>({tracks:null});
  //강제 업데이트
  const [, updateState] = useState<undefined | {}>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [isLoading, setIsLoading] = useState(false);
  const { auth, isLogin, isHorizon } = useSelector((state: RootState) => {
    return {
      auth: state.user.auth,
      isLogin: state.user.isLogin,
      isHorizon: state.orientation.isHorizon
    };
  });

  const {
    navigation,
    route: { params }
  }: MeetNavigationProps<'SettingView'> = props;
  const { webAuth } = props;

  const dispatch = useDispatch();
  const setAlert = (params: any) => dispatch(AlertAcions.setAlert(params));
  const setConferenceExpireTime = (expireTime: number | null) =>
    dispatch(LocalActions.setConferenceExpireTime(expireTime));

  const t = getT();

  useEffect(() => {
    _jitsiInit();
    _getSetting();
  }, []);

  const _goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else {
      // 직접 URL주소를 통해서 들어왔을때 처리
      if (auth.user_no) {
        navigation.reset({ routes: [{ name: 'MainStack' }] });
      } else {
        navigation.reset({ routes: [{ name: 'LoginStack' }] });
      }
    }
  };
  const _jitsiInit = () => {
    // JitsiMeetJS 를 초기화 한다.
    JitsiMeetJS.init({
      ...config
    });

    // JitsiMeetJS Log Level을 설정한다.
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  };

  const _getSetting = async () => {
    let tracks = await _getTrack();
    // ref.current.tracks = tracks
    setTracks(tracks ? tracks : null);
    setNameField(!isLogin);
    setButtonActive(tracks ? true : false);
  };

  const _getTrack = async () => {
    // const devices = ['video', 'audio'];
    try {
      const videoTrack = await JitsiMeetJS.createLocalTracks({
        devices: ['video'],
        resolution: 320
      });
      const audioTrack = await JitsiMeetJS.createLocalTracks({
        devices: ['audio'],
        resolution: 320
      });
      return [videoTrack[0], audioTrack[0]];
    } catch (error) {
      setAlert({
        type: 1,
        title: t('renewal.alert_title_right'),
        message: t('renewal.alert_text_permission')
      });
      return null;
    }
  };

  const _handleConferenceEnter = async () => {
    // let { tracks, nameField } = this.state;
    setIsLoading(true);
    let tmpName;

    if (nameField) {
      tmpName = name;
      if (!tmpName) {
        tmpName = (await MeetApi.getExternalUserId(params.id)).resultData;
      }
    } else {
      tmpName = webAuth?.user_name ? webAuth?.user_name : auth.user_name;
    }

    let roomToken;

    // const wedive = await MeetApi.checkWedrive(auth);

    const randomstring = uuidv4();
    const user = randomstring.substr(0, 8);

    if (params?.accessType === 'email') {
      roomToken = (
        await MeetApi.getMeetRoomTokenEmail(params.id, params.emailToken, name)
      ).resultData;
    } else if (params?.accessType === 'joincode') {
      roomToken = (
        await MeetApi.getMeetRoomTokenJoincode(
          params.id,
          params.joincode,
          tmpName,
          user
        )
      ).resultData;
    } else {
      // 토큰받고
      roomToken = (await MeetApi.getMeetRoomToken(auth, params.id)).resultData;
    }

    if (roomToken === '접근금지') {
      // wehago V 때문에 절차가 하나 늘어남
      setAlert({
        type: 1,
        title: t('renewal.alert_title_error'),
        message: t('renewal.alert_text_waiting')
      });
    } else {
      const {
        resultData: { expire_time }
      } = await MeetApi.getExpireTime(params.id);

      setConferenceExpireTime(expire_time);

      navigation.reset({
        routes: [
          {
            name: 'ConferenceView',
            params: {
              tracks,
              roomToken,
              name: tmpName,
              ...params,
              accessType: params?.accessType,
              externalUser: user
            }
          }
        ]
      });
    }
    setIsLoading(false);
  };

  const _handleToggleVideo = async () => {
    const video = tracks && tracks[0];
    if (video.isMuted()) {
      await video.unmute();
    } else {
      await video.mute();
    }
    forceUpdate();
    setTracks(tracks);
  };

  const _handleToggleAudio = async () => {
    const audio = tracks && tracks[1];
    if (audio.isMuted()) {
      await audio.unmute();
    } else {
      await audio.mute();
    }
    forceUpdate();
    setTracks(tracks);
  };

  // console.log('!@!@#!');
  // console.log(params);

  return (
    <SettingScreenPresenter
      tracks={tracks}
      nameField={nameField}
      buttonActive={buttonActive}
      onConferenceEnter={_handleConferenceEnter}
      onToggleAudio={_handleToggleAudio}
      onToggleVideo={_handleToggleVideo}
      setName={setName}
      goBack={_goBack}
      isHorizon={isHorizon}
      roomName={params.selectedRoomName}
      isLoading={isLoading}
    />
  );
}
