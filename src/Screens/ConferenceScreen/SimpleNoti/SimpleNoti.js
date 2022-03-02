// 확장성을 고려해봤지만 관리가 쉽게끔 그냥 여기서 전부 처리하는게 나아보임

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import { useSelector, useDispatch } from 'react-redux';

const isPad = deviceInfoModule.isTablet();
const { width, height } = Dimensions.get('screen');

export default function SimpleNoti() {
  const toggleFlag = useSelector(state => state.toast['toggleFlag']);
  const toastMessage = useSelector(state => state.toast['toastMessage']);

  const [isFirst, setIsFirst] = useState(true);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [fadeout, setFadeout] = useState(null);

  const fadeIn = () => {
    Animated.timing(fadeAnimation).stop();
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnimation).stop();
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 1000
    }).start();
  };

  useEffect(() => {
    if (isFirst) {
      if (toastMessage) {
        setMessage(toastMessage);
        fadeIn(true);
        setFadeout(
          setTimeout(() => {
            fadeOut(false);
          }, 2000)
        );
      }
      setIsFirst(false);
    }
    return () => {
      setIsFirst(true);
      dispatch({
        type: 'master.TOAST_MESSAGE',
        toastMessage: ''
      });
    };
  }, []);

  useEffect(() => {
    if (isFirst) return;
    if (fadeout) clearTimeout(fadeout);
    setMessage(toastMessage);
    fadeIn(true);
    setFadeout(
      setTimeout(() => {
        fadeOut(false);
      }, 2000)
    );
  }, [toggleFlag]);

  return message ? (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnimation // Bind opacity to animated value
        },
        isPad && {
          bottom: height * 0.3,
          width: 343,
          marginHorizontal: (width - 343) / 2
        }
      ]}
    >
      {/* <View style={[styles.container, { opacity: fadeAnimation }]}> */}
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.noti}>{message}</Text>
      </View>
      {/* </View> */}
    </Animated.View>
  ) : null;
  // ) : (
  //   <></>
  // );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    height: 48,
    borderRadius: 10,
    left: 0,
    right: 0,
    bottom: height * 0.7,
    backgroundColor: 'rgba(0,0,0,0.75)',
    elevation: 4,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.04
  },
  noti: {
    fontFamily: 'DOUZONEText30',
    fontSize: 13,
    lineHeight: 21,
    color: '#fff'
  }
});
