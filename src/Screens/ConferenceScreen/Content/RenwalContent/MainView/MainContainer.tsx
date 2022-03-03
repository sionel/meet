import { getT } from '@utils/translateManager';
import React, { useEffect, useState } from 'react';
import { BackHandler, NativeModules, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { actionCreators as ScreenShareCreators } from '@redux/ScreenShare';
import MainPresenter from './MainPresenter';

const { PictureInPicture } = NativeModules;

type MainContainerProps = {
  mainUser: any;
  onClose: () => void;
  isVideoReverse: boolean;
  objectFit: 'cover' | 'contain';
  isMultipleView: boolean;
};

const MainContainer = (props: MainContainerProps) => {
  const [exitContent, setExitContent] = useState(false);
  const t = getT();

  let timeout: ReturnType<typeof setTimeout>,
    timer: ReturnType<typeof setInterval>;

  const { localPipMode, drawingMode, isScreenShare } = useSelector(
    (state: RootState) => {
      const { local, mainUser, screenShare } = state;
      return {
        localPipMode: local.pipMode,
        drawingMode: mainUser.drawingMode,
        isScreenShare: screenShare.isScreenShare
      };
    }
  );

  const dispatch = useDispatch();
  const toggleScreenFlag = () =>
    dispatch(ScreenShareCreators.toggleScreenFlag());

  const {
    mainUser: { videoTrack, isMuteVideo },
    onClose,
    isVideoReverse,
    objectFit,
    mainUser,
    isMultipleView
  } = props;

  const stream = !isMuteVideo && videoTrack && videoTrack.getOriginalStream();
  const videoType = videoTrack && videoTrack.videoType;

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', _handleBackButton);

      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const _handleBackButton = () => {
    _handleEnterPIPMode('BACK');

    // 앱 종료를 막는다.
    // true: 대기 / false: 뒤로가기
    return true;
  };

  // console.log('mainUser : ', mainUser);
  
  
  
  let character = '';
  if (mainUser?.userInfo?.avatar) {
    character = JSON.parse(mainUser?.userInfo?.avatar)?.value;
  } else {
    character = isMuteVideo ? 'jangok' : character;
  }

  const _handleEnterPIPMode = (type: string) => {
    PictureInPicture.enterPictureInPicture().catch(() => {
      // Picture-in-Picture not supported
      // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
      if (type === 'BACK') {
        if (exitContent == undefined || !exitContent) {
          ToastAndroid.show(t('toast_closeapp'), ToastAndroid.SHORT);
          setExitContent(true);

          timeout = setTimeout(() => {
            setExitContent(false);
          }, 1000);
        } else {
          clearTimeout(timeout);
          if (timer) {
            clearInterval(timer);
          }

          onClose(); // 컴포넌트 종료
        }
      }
    });
  };

  return (
    <MainPresenter
      isMuteVideo={isMuteVideo}
      stream={stream}
      videoType={videoType}
      isVideoReverse={isVideoReverse}
      drawing={drawingMode}
      localPipMode={localPipMode}
      objectFit={objectFit}
      mainUser={mainUser}
      isMultipleView={isMultipleView}
      isScreenShare={isScreenShare}
      toggleScreenFlag={toggleScreenFlag}
      character={character}
    />
  );
};

export default MainContainer;
