import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

const useDeepLink = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    _setLinkingEvent();
  }, []);
  const _setLinkingEvent = () => {
    // 앱 처음 진입시 (ios / android , deeplink android)
    Linking.getInitialURL().then(url => {
      debugger;
      url && _handleGetDeeplink({ url });
    });

    // 앱 실행중일때 (deeplink ios)
    Linking.addEventListener('url', (url) => {
      debugger
      _handleGetDeeplink(url);
    });
  };

  const _handleGetDeeplink = ({ url }: { url: string }) => {
    debugger;
    setUrl(url);
    if (!url) return;
    // let { name } = navigationRef.current.getCurrentRoute();
    // if (isConference && name === 'ConferenceView') {
    //   _deeplinkWhenConferenceOngoing();
    // } else {
    //   _deeplinkNormalAccess(url);
    // }
  };

  return [url];
};

export default useDeepLink;
