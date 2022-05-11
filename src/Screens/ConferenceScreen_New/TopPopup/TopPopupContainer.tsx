import React, { useEffect, useRef, useState } from 'react';
import TopPopupPresenter from './TopPopupPresenter';
import { TopPopupContainerProps } from '../types';
import { Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { actionCreators as ToastActions} from '@redux/toast';

const TopPopupContainer: React.FC<TopPopupContainerProps> = ({}) => {
  const [isFirst, setIsFirst] = useState(true);
  const [fadeout, setFadeout] = useState<any>(null);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const { toggleFlag, toastMessage, requestUserList } = useSelector(
    (state: RootState) => {
      return {
        toggleFlag: state.toast.toggleFlag,
        toastMessage: state.toast.toastMessage,
        requestUserList: state.master.requestUserList
      };
    }
  );

  const dispatch = useDispatch();
  const setToastMessage = (toastMessage: string) => {
    dispatch(ToastActions.setToastMessage(toastMessage));
  };


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
      if (toastMessage) {
        setMessage(toastMessage);
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
      setToastMessage('');
    };
  }, []);

  useEffect(() => {
    if (isFirst) return;
    if (fadeout) clearTimeout(fadeout);
    setMessage(toastMessage);
    fadeIn();
    setFadeout(
      setTimeout(() => {
        fadeOut();
      }, 2000)
    );
  }, [toggleFlag]);

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  return (
    <TopPopupPresenter
      requestUserList={requestUserList}
      message={message}
      fadeAnimation={fadeAnimation}
    />
  );
};
export default TopPopupContainer;
