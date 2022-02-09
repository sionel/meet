import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as localAction } from '@redux/local';
import { actionCreators as mainUserAction } from '@redux/mainUser';
import { actionCreators as ScreenShareAction } from '@redux/ScreenShare';
import { RootState } from 'src/redux/configureStore';
import TopAreaPresenter from './TopAreaPresenter';
import { Alert, Platform } from 'react-native';

type TopAreaContainerProps = {
  callType: number;
  onReverseVideo: () => void;
  onChangeDrawing: () => void;
  onChangeDrawingMode: () => void;
  mainUser: any;
  elapsedTime: number;
};

const TopAreaContainer = (props: TopAreaContainerProps) => {
  const [isMainUserMaster, setIsMainUserMaster] = useState(false);
  const { callType, mainUser, elapsedTime } = props;
  const {
    conferenceMode,
    user,
    participants,
    videoPolicy,
    loginType,
    memberType,
    auth,
    deployedServices,
    isScreenShare,
    orientation,
    masters
  } = useSelector((state: RootState) => {
    const {
      local,
      root,
      user,
      deployed,
      screenShare,
      orientation,
      participants,
      master
    } = state;
    return {
      conferenceMode: local.conferenceMode,
      user: local.user,
      participants: participants.list,
      videoPolicy: root.videoPolicy,
      loginType: user.loginType,
      memberType: user.auth.member_type,
      auth: user.auth,
      deployedServices: deployed.deployedServices,
      isScreenShare: screenShare.isScreenShare,
      orientation: orientation.orientation,
      masters: master.masterList
    };
  });
  const dispatch = useDispatch();
  const toggleCameraFacingMode = () =>
    dispatch(localAction.toggleCameraFacingMode());
  const toggleDocumentListMode = (documentListMode: string[]) =>
    dispatch(mainUserAction.setDocumentListMode(documentListMode));
  const setScreenFlag = (flag: boolean) =>
    dispatch(ScreenShareAction.setScreenFlag(flag));
  const toggleScreenFlag = () => dispatch(ScreenShareAction.toggleScreenFlag());

  const talkButton = callType === 3;
  const penButton = true;
  const docShareButton =
    memberType !== 1 && deployedServices.includes('wedrive');
  const screenShareButton = Platform.OS === 'ios' ? !Platform.isPad : true;
  const switchButton = !isScreenShare;
  const reverseButton = !isScreenShare;

  const second2String = (second: number) => {
    let hours: any = Math.floor(second / 3600);
    let minutes: any = Math.floor((second - hours * 3600) / 60);
    let seconds: any = Math.floor(second - hours * 3600 - minutes * 60);

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  };

  let time = second2String(elapsedTime);
  let userList = participants.slice(0);

//   console.log(userList);
  

  userList.unshift({
    ...user,
    userInfo: {
      profile_url: auth.profile_url,
      wehagoId: auth.portal_id,
      userName: auth.user_name,
      nickname: auth.nickname
    }
  });

  userList.forEach((user: any) => {
    user.isMaster = masters.includes(user?.userInfo?.wehagoId);
  });

  useEffect(() => {
    //   console.log('mainUser1 : ', mainUser);
      
    userList.find(v => {
      if(v.id === mainUser.id) {
          v.isMaster === true
            ? setIsMainUserMaster(true)
            : setIsMainUserMaster(false);
      }
    });
  }, [mainUser.id]);

  return (
    <TopAreaPresenter
      talkButton={talkButton}
      penButton={penButton}
      docShareButton={docShareButton}
      screenShareButton={screenShareButton}
      switchButton={switchButton}
      reverseButton={reverseButton}
      orientation={orientation}
      onChangeDrawingMode={props.onChangeDrawingMode}
      toggleDocumentListMode={toggleDocumentListMode}
      toggleScreenFlag={toggleScreenFlag}
      toggleCameraFacingMode={toggleCameraFacingMode}
      onReverseVideo={props.onReverseVideo}
      conferenceMode={conferenceMode}
      mainUser={mainUser}
      elapsedTime={time}
      isMaster={isMainUserMaster}
    />
  );
};

export default TopAreaContainer;
