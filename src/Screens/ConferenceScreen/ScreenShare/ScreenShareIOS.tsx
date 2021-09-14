import React, { useEffect, useState } from 'react';
import { View, Text, findNodeHandle, NativeModules } from 'react-native';
import { ScreenCapturePickerView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';

export default function ScreenShareIOS(props) {
  const screenToggleFlag = useSelector(
    state => state.screenShare['screenToggleFlag']
  );
  let _nativeComponent;
  const _setNativeComponent = component => {
    _nativeComponent = component;
  };

  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    debugger;
    if (!isFirst) {
      const handle = findNodeHandle(_nativeComponent);
      NativeModules.ScreenCapturePickerViewManager.show(handle);
    } else setIsFirst(false);
  }, [screenToggleFlag]);

  return <ScreenCapturePickerView ref={_setNativeComponent} />;
}
