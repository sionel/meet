import React, { useEffect, useState } from 'react';
import { findNodeHandle, NativeModules } from 'react-native';
import { ScreenCapturePickerView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

export default function ScreenShareIOS(props: any) {
  const { screenToggleFlag } = useSelector((state: RootState) => ({
    screenToggleFlag: state.screenShare.screenToggleFlag
  }));
  let _nativeComponent: any;
  const _setNativeComponent = (component: any) => {
    _nativeComponent = component;
  };

  const [isFirst, setIsFirst] = useState(true);
  // const [onSharing, setOnSharing] = useState(false);

  useEffect(() => {
    if (!isFirst && screenToggleFlag) {
      const handle = findNodeHandle(_nativeComponent);
      // setOnSharing(!onSharing);
      NativeModules.ScreenCapturePickerViewManager.show(handle);
    } else setIsFirst(false);
  }, [screenToggleFlag]);

  return <ScreenCapturePickerView ref={_setNativeComponent} />;
}
