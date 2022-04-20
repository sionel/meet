import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

const useDeepLink = (props: any) => {
  const [url, setUrl] = useState(props.url?.url);
  Linking.getInitialURL().then(url => {});

  useEffect(() => {
    const url = props.url?.url;
    setUrl(url)
  }, [props]);

  return [];
};

export default useDeepLink;
