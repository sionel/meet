// 확장성을 고려해봤지만 관리가 쉽게끔 그냥 여기서 전부 처리하는게 나아보임

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
export default function SimpleNoti() {
  const isMasterControl = useSelector(state => state.local['isMasterControl']);
  const isMasterMicControl = useSelector(
    state => state.local['isMasterMicControl']
  );
  const isMuteMic = useSelector(state => state.local['user']['isMuteMic']);
  const messageFlag = useSelector(state => state.local['messageFlag']);
  const toastMessage = useSelector(state => state.local['toastMessage']);

  const dispatch = useDispatch();

  const [isFirst, setIsFirst] = useState(true);
  const [message, setMessage] = useState('');
  //   const [masterControlFlag, setMasterControlFlag] = useState(false);
  //   const [masterControlFlag, setMasterControlFlag] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fadeout, setFadeout] = useState(null);

  const fadeIn = () => {
    Animated.timing(fadeAnim).stop();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim).stop();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000
    }).start();
  };

  useEffect(() => {
    if (isFirst) return;

    if (isMasterMicControl) {
      if (fadeout) clearTimeout(fadeout);

      setMessage(
        isMuteMic
          ? '마스터가 마이크를 비활성화 처리 했습니다.'
          : '마스터가 마이크를 활성화 처리 했습니다.'
      );

      fadeIn(true);
      setFadeout(
        setTimeout(() => {
          fadeOut(false);
        }, 2000)
      );
    }
  }, [isMuteMic]);

  useEffect(() => {
    setIsFirst(false);
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

  useEffect(() => {
    if (isFirst) return;
    else {
      if (fadeout) clearTimeout(fadeout);

      setMessage(
        isMasterControl
          ? '마스터가 참여자 전원의 발언권 제어를 시작합니다.'
          : '참여자 발언권 제어기능이 종료 되었습니다.'
      );
      fadeIn(true);
      setFadeout(
        setTimeout(() => {
          fadeOut(false);
        }, 2000)
      );
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
