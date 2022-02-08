import { getT } from '@utils/translateManager';
import React, { useEffect, useState } from 'react';
import { BackHandler, NativeModules, ToastAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import MainPresenter from './MainPresenter';

const { PictureInPicture } = NativeModules;

type MainContainerProps = {
  mainUser: any;
  onClose: () => void;
};

const MainContainer = (props: MainContainerProps) => {
  const [exitContent, setExitContent] = useState(false);
  const t = getT();
  let timeout: ReturnType<typeof setTimeout>,
    timer: ReturnType<typeof setInterval>;

  const {
    videoPolicy,
    auth,
    loginType,
    createdTime,
    localPipMode,
    drawingMode
  } = useSelector((state: RootState) => {
    const { root, user, local, mainUser } = state;
    return {
      videoPolicy: root.videoPolicy,
      auth: user.auth,
      loginType: user.loginType,
      createdTime: local.createdTime,
      localPipMode: local.pipMode,
      drawingMode: mainUser.drawingMode
    };
  });

  const {
    mainUser: { videoTrack, isMuteVideo },
    onClose
  } = props;

  const stream = !isMuteVideo && videoTrack && videoTrack.getOriginalStream();
  const videoType = videoTrack && videoTrack.videoType;

  useEffect(() => {
    // timer = setInterval(() => {
    //   if (createdTime) {
    //     let time = Math.floor((Date.now() - createdTime) / 1000);
    //     time > 0 && setState({ time });
    //     if (
    //       (videoPolicy === 'nahago' || loginType === 'nahago') &&
    //       time >= 3600
    //     ) {
    //       setAlert({
    //         title: '회의 종료',
    //         type: 1,
    //         message: '회의시간이 60분 지나 회의가 종료됩니다.',
    //         onConfirm: props.onClose
    //       });
    //     }
    //   }

    // }, 500);

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
      // isVideoReverse={isVideoReverse}
      drawing={drawingMode}
      localPipMode={localPipMode}
    />
  );
};

export default MainContainer;
