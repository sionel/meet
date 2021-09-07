import React, { useEffect } from 'react';
import { View, Text, findNodeHandle, NativeModules } from 'react-native';
import { ScreenCapturePickerView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';

export default function ScreenShareIOS(props) {
  const isScreenShare = useSelector(state => state.screenShare['isScreenShare']);

  let _nativeComponent;
  const _setNativeComponent = component => {
    _nativeComponent = component;
  };

  useEffect(() => {
    if (isScreenShare) {
      const handle = findNodeHandle(_nativeComponent);
      NativeModules.ScreenCapturePickerViewManager.show(handle);
    }
  }, [isScreenShare]);

  return <ScreenCapturePickerView ref={_setNativeComponent} />;
}
