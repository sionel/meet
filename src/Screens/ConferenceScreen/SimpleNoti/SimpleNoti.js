// 확장성을 고려해봤지만 관리가 쉽게끔 그냥 여기서 전부 처리하는게 나아보임

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
export default function SimpleNoti() {
  const messageFlag = useSelector(state => state.toast['messageFlag']);
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
  }, [messageFlag]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnimation // Bind opacity to animated value
        }
      ]}
    >
      {/* <View style={[styles.container, { opacity: fadeAnimation }]}> */}
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.noti}>{message}</Text>
      </View>
      {/* </View> */}
    </Animated.View>
  );
  // ) : (
  //   <></>
  // );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 150,
    left: 10,
    right: 10,
    zIndex: 10
  },
  noti: {
    fontSize: 15,
    alignItems: 'center',
    backgroundColor: '#01a680',
    padding: 10
  }
});
