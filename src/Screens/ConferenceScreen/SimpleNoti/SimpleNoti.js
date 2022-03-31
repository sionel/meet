// 확장성을 고려해봤지만 관리가 쉽게끔 그냥 여기서 전부 처리하는게 나아보임

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList
} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as masterActionCreators } from '@redux/master';
import { getT } from '@utils/translateManager';

import _ from 'underscore';
import { getConferenceManager } from '@utils/ConferenceManager';

const isPad = deviceInfoModule.isTablet();
// const { width, height } = Dimensions.get('screen');

export default function SimpleNoti() {
  const { toggleFlag, toastMessage, userList } = useSelector(state => {
    const { toast, master } = state;
    return {
      toggleFlag: toast.toggleFlag,
      toastMessage: toast.toastMessage,
      userList: master.targetUserList
    };
  });
  // const toggleFlag = useSelector(state => state.toast['toggleFlag']);
  // const toastMessage = useSelector(state => state.toast['toastMessage']);
  const t = getT();
  const [width, setWidth] = useState(Dimensions.get('screen').width);
  const [height, setHeight] = useState(Dimensions.get('screen').height);

  const [isFirst, setIsFirst] = useState(true);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const setIsUserMicRequest = () =>
    dispatch(masterActionCreators.setUserMicRequest(false));

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

  const replyUserRequest = (jitsid, command) => {
    let conferenceManager = getConferenceManager();
    conferenceManager.replyUserRequest(jitsid, command);
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

  useEffect(() => {
    const updateLayout = () => {
      setWidth(Dimensions.get('screen').width);
      setHeight(Dimensions.get('screen').height);
    };

    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  });

  const micRequestPopup = targetUser => (
    <View style={styles.requestView}>
      <View style={{ alignItems: 'flex-start', marginRight: 30 }}>
        <Text style={styles.requestTitle}>{t('발언권 요청')}</Text>
        <Text
          style={styles.requestContent}
        >{`${targetUser.name} 님이 발언권을 요청하였습니다.`}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={_.throttle(() => replyUserRequest(targetUser, true), 750)}
        >
          <Text style={styles.buttonText}>{t('수락')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.denyButton}
          onPress={_.throttle(() => replyUserRequest(targetUser, false), 750)}
        >
          <Text style={styles.buttonText}>{t('거부')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return userList.length > 0 ? (
    <FlatList
      style={[styles.userListView, { top: height * 0.2 }]}
      scrollEnabled={userList.length > 2}
      data={userList}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        return micRequestPopup(item);
      }}
    />
  ) : message ? (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnimation, // Bind opacity to animated value
          marginHorizontal: width * 0.04,
          bottom: height * 0.7
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
    backgroundColor: 'rgba(0,0,0,0.75)',
    elevation: 4,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noti: {
    fontFamily: 'DOUZONEText30',
    fontSize: 13,
    lineHeight: 21,
    color: '#fff'
  },
  userListView: {
    position: 'absolute',
    flex: 1,
    minHeight: 100,
    maxHeight: 400,
    left: 0,
    right: 0,
    elevation: 4,
    zIndex: 4
  },
  requestView: {
    width: '90%',
    height: 100,
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  requestTitle: {
    color: '#fff',
    fontFamily: 'DOUZONEText50',
    fontSize: 15,
    lineHeight: 30
  },
  requestContent: {
    color: '#fff',
    fontFamily: 'DOUZONEText30',
    fontSize: 13
  },
  acceptButton: {
    backgroundColor: '#1c90fb',
    width: 40,
    height: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  denyButton: {
    backgroundColor: '#fc5356',
    width: 40,
    height: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff'
  }
});
