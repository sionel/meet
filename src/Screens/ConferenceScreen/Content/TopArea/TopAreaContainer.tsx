import TopAreaPresenter from './TopAreaPresenter';
import React from 'react';
import { Platform } from 'react-native';
import { ConferenceModes } from '@utils/ConstantsBackup';
import { useDispatch, useSelector } from 'react-redux';

import { actionCreators as localAction } from '@redux/local';
import { actionCreators as mainUserAction } from '@redux/mainUser';
import { actionCreators as ScreenShareAction } from '@redux/ScreenShare';
import { RootState } from '../../../../redux/configureStore';

function TopAreaContainer(props) {
  const { conferenceMode, memberType, deployedServices, isScreenShare } =
    useSelector((state: RootState) => {
      return {
        conferenceMode: state.local.conferenceMode,
        memberType: state.user.auth.member_type,
        deployedServices: state.deployed.deployedServices,
        isScreenShare: state.screenShare.isScreenShare
      };
    });
  const dispatch = useDispatch();
  const toggleCameraFacingMode = () =>
    dispatch(localAction.toggleCameraFacingMode());
  const toggleDocumentListMode = documentListMode =>
    dispatch(mainUserAction.setDocumentListMode(documentListMode));
  const setScreenFlag = flag => dispatch(ScreenShareAction.setScreenFlag(flag));
  const toggleScreenFlag = () => dispatch(ScreenShareAction.toggleScreenFlag());

  const controlMode = conferenceMode === ConferenceModes.CONTROL;
  const talkButton = props.callType === 3;
  const penButton = true;
  const docShareButton =
    memberType !== 1 && deployedServices.includes('wedrive');
  const screenShareButton = Platform.OS === 'ios' ? !Platform.isPad : true;
  const switchButton = !isScreenShare;
  const reverseButton = !isScreenShare;

  return (
    <TopAreaPresenter
      {...{
        controlMode,
        talkButton,
        penButton,
        docShareButton,
        screenShareButton,
        switchButton,
        reverseButton,
        toggleCameraFacingMode,
        toggleDocumentListMode,
        setScreenFlag,
        toggleScreenFlag,
        orientation: props.orientation,
        onChangeDrawingMode: props.onChangeDrawingMode,
        onReverseVideo: props.onReverseVideo
      }}
    />
  );
}

export default TopAreaContainer;
