import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

export function useScreenShareStatus() {
  const ExternalAPI = NativeModules.ExternalAPI;
  const eventEmitter = new NativeEventEmitter(ExternalAPI);
  const [isScreenShare, setIsScreenShare] = useState(false);

  useEffect(() => {
    const handelStatusChange = () => {
      setIsScreenShare(!isScreenShare);
    };

    eventEmitter.addListener(
      ExternalAPI.TOGGLE_SCREEN_SHARE,
      handelStatusChange
    );
    return () => {
      eventEmitter.removeAllListeners(ExternalAPI.TOGGLE_SCREEN_SHARE);
    };
  });

  return isScreenShare;
}
