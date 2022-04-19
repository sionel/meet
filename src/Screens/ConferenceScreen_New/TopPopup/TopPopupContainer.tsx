import React, { useEffect, useRef, useState } from 'react';
import TopPopupPresenter from './TopPopupPresenter';
import { TopPopupContainerProps } from '../types';
import { Animated } from 'react-native';

const TopPopupContainer: React.FC<TopPopupContainerProps> = ({}) => {
  const [isFirst, setIsFirst] = useState(true);
  const [fadeout, setFadeout] = useState<any>(null);

  const [message, setMessage] = useState<string | undefined>('테스트중입니다.');

  const fadeIn = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).stop();
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).stop();

    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    if (isFirst) {
      if (message) {
        // setMessage(toastMessage);
        fadeIn();
        setFadeout(
          setTimeout(() => {
            fadeOut();
          }, 2000)
        );
      }
      setIsFirst(false);
    }
    return () => {
      setIsFirst(true);
      setMessage(undefined);
      // dispatch({
      //   type: 'master.TOAST_MESSAGE',
      //   toastMessage: ''
      // });
    };
  }, []);

  useEffect(() => {
    if (isFirst) return;
    if (fadeout) clearTimeout(fadeout);
    // setMessage(toastMessage);
    fadeIn();
    setFadeout(
      setTimeout(() => {
        fadeOut();
      }, 2000)
    );
  }, []);

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  return (
    <TopPopupPresenter
      userList={[]}
      message={message}
      fadeAnimation={fadeAnimation}
    />
  );
};
export default TopPopupContainer;
