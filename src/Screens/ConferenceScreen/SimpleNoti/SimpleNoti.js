// 확장성을 고려해봤지만 관리가 쉽게끔 그냥 여기서 전부 처리하는게 나아보임

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { useSelector } from 'react-redux';

export default function SimpleNoti() {
  const isMasterControl = useSelector(state => state.local['isMasterControl']);

  const [isFirst, setIsFirst] = useState(true);
  const [message, setMessage] = useState('');
  //   const [masterControlFlag, setMasterControlFlag] = useState(false);
  //   const [masterControlFlag, setMasterControlFlag] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000
    }).start();
  };

  useEffect(() => {
    debugger
    setIsFirst(true);
  }, []);

  useEffect(() => {
    debugger
    if (isFirst) return;
    else {
      setMessage(
        isMasterControl
          ? '마스터가 참여자 전원의 발언권 제어를 시작합니다.'
          : '참여자 발언권 제어기능이 종료 되었습니다.'
      );
      fadeIn(true);
      setTimeout(() => {
        fadeOut(false);
      }, 2000);
    }
  }, [isMasterControl]);

  //return //showFlag ? (
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim // Bind opacity to animated value
        }
      ]}
    >
      {/* <View style={[styles.container, { opacity: fadeAnim }]}> */}
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
