import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as localAction } from '@redux/local';
import { actionCreators as mainUserAction } from '@redux/mainUser';
import { actionCreators as ScreenShareAction } from '@redux/ScreenShare';
import { RootState } from 'src/redux/configureStore';
import TopAreaPresenter from './TopAreaPresenter';
import { Alert, Platform } from 'react-native';
import { ConferenceBottomPopupProps } from '../../ContentContainer';
import { getT } from '@utils/translateManager';

import icDocument from '@assets/icons/ic_document.png';
import icHand from '@assets/icons/ic_hand.png';
import icRecord from '@assets/icons/ic_record.png';
import icSketch from '@assets/icons/ic_sketch.png';
import icWrite from '@assets/icons/ic_write.png';
import { participantsListProps } from '@components/renewal/ParticipantsList';
import { ParticipantsTypes } from '@redux/participants';

type TopAreaContainerProps = {
  callType: number;
  onReverseVideo: () => void;
  onChangeDrawing: () => void;
  onChangeDrawingMode: () => void;
  mainUser: any;
  elapsedTime: number;
  handleBottomPopup: React.Dispatch<
    React.SetStateAction<ConferenceBottomPopupProps>
  >;
  bottomPopup: ConferenceBottomPopupProps;
  userList: ParticipantsTypes[];
  isMultipleView: boolean;
  setIsMultipleView: () => void;
  selectedRoomName: string
};

const TopAreaContainer = (props: TopAreaContainerProps) => {
  const t = getT();
  const [isMainUserMaster, setIsMainUserMaster] = useState(false);
  const {
    callType,
    mainUser,
    elapsedTime,
    bottomPopup,
    handleBottomPopup,
    userList,
    isMultipleView,
    selectedRoomName
  } = props;
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

  useEffect(() => {
    userList.find(v => {
      if (v.id === mainUser.id) {
        v.isMaster === true
          ? setIsMainUserMaster(true)
          : setIsMainUserMaster(false);
      }
    });
  }, [mainUser.id]);

  const onExitPopup = () => {
    handleBottomPopup({
      ...bottomPopup,
      show: false
    });
  };

  const handdleMoreClick = () => {
    if (bottomPopup.show) {
      onExitPopup();
    } else {
      const sketch = {
        icon1: icSketch,
        name: t('스케치'),
        onClick: () => {}
      };
      const document = {
        icon1: icDocument,
        name: t('문서공유'),
        onClick: () => {}
      };
      const hand = {
        icon1: icHand,
        name: t('발언권'),
        onClick: () => {}
      };
      const record = {
        icon1: icRecord,
        name: t('회의녹화'),
        onClick: () => {}
      };
      const write = {
        icon1: icWrite,
        name: t('자동 회의록'),
        onClick: () => {}
      };

      handleBottomPopup({
        contentList: [sketch, document, hand, record, write],
        show: true,
        title: t('더보기')
      });
    }
  };

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
      handdleMoreClick={handdleMoreClick}
      isMultipleView={isMultipleView}
      selectedRoomName={selectedRoomName}
    />
  );
};

export default TopAreaContainer;
