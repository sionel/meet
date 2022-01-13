import React, { useEffect, useState } from 'react';
import { View, Text, findNodeHandle, NativeModules } from 'react-native';
import { ScreenCapturePickerView } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/configureStore';

export default function ScreenShareIOS(props: any) {
  const screenToggleFlag = useSelector(
    (state: RootState) => state.screenShare['screenToggleFlag']
  );
  let _nativeComponent: any;
  const _setNativeComponent = (component: any) => {
    _nativeComponent = component;
  };

  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (!isFirst) {
      const handle = findNodeHandle(_nativeComponent);
      NativeModules.ScreenCapturePickerViewManager.show(handle);
    } else setIsFirst(false);
  }, [screenToggleFlag]);

  return <ScreenCapturePickerView ref={_setNativeComponent} />;
}
