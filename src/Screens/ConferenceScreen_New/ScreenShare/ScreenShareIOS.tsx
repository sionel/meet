import React, { useEffect, useState } from 'react';
import {
  findNodeHandle,
  NativeEventEmitter,
  NativeModules
} from 'react-native';
import { ScreenCapturePickerView } from 'react-native-webrtc';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { useScreenShareStatus } from './hooks/useScreenShare';


export default function ScreenShareIOS(props: any) {
  const { screenToggleFlag } = useSelector((state: RootState) => ({
    screenToggleFlag: state.screenShare.screenToggleFlag
  }));
  let _nativeComponent: any;
  const _setNativeComponent = (component: any) => {
    _nativeComponent = component;
  };
  // const isScreenShare = useScreenShareStatus();
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    debugger
    console.log('screenToggleFlag : ', screenToggleFlag);
    if (!isFirst) {
      const handle = findNodeHandle(_nativeComponent);
      NativeModules.ScreenCapturePickerViewManager.show(handle);
    } else setIsFirst(false);
  }, [screenToggleFlag]);

  return <ScreenCapturePickerView ref={_setNativeComponent} />;
}
