import TopAreaPresenter from './TopAreaPresenter';
import React from 'react';
import { Platform } from 'react-native';
import { ConferenceModes } from '../../../../utils/ConstantsBackup';
import { useDispatch, useSelector } from 'react-redux';

import { actionCreators as localAction } from '../../../../redux/modules/local';
import { actionCreators as mainUserAction } from '../../../../redux/modules/mainUser';
import { actionCreators as ScreenShareAction } from '../../../../redux/modules/ScreenShare';
import { actionCreators as documentShareAction } from '../../../../redux/modules/documentShare';
import { RootState } from '../../../../redux/configureStore';

function TopAreaContainer(props:any) {
  const {
    conferenceMode,
    memberType,
    deployedServices,
    isScreenShare,
    expireTime
  } = useSelector((state: RootState) => {
    return {
      conferenceMode: state.local.conferenceMode,
      memberType: state.user.auth.member_type,
      deployedServices: state.deployed.deployedServices,
      isScreenShare: state.screenShare.isScreenShare,
      expireTime: state.local.expireTime,
    };
  });
  
  const dispatch = useDispatch();
  const toggleCameraFacingMode = () =>
    dispatch(localAction.toggleCameraFacingMode());
  const toggleDocumentListMode = (documentListMode:any) =>
    dispatch(documentShareAction.setDocumentListMode(documentListMode));
  const setScreenFlag = (flag:any) => dispatch(ScreenShareAction.setScreenFlag(flag));
  const toggleScreenFlag = () => dispatch(ScreenShareAction.toggleScreenFlag());

  const controlMode = conferenceMode === ConferenceModes.CONTROL;
  const talkButton = props.callType === 3;
  const penButton = true;
  const docShareButton = !expireTime && deployedServices.includes('wedrive');
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
