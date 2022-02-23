import { ParticipantsTypes } from '@redux/participants';
import { ConferenceBottomPopupProps } from '@screens/ConferenceScreen/Content/ContentContainer';
import { getT } from '@utils/translateManager';
import React, { Component, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  NativeTouchEvent
} from 'react-native';
import UserListPresenter from './UserListPresenter';

type SwipeList = ParticipantsTypes;
type UserListContainer = {
  contentList: ParticipantsTypes[];
  bottomPopup: ConferenceBottomPopupProps;
  handleBottomPopup: React.Dispatch<
    React.SetStateAction<ConferenceBottomPopupProps>
  >;
  setIsPopupTouch: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserListContainer = (props: UserListContainer) => {
  const t = getT();
  const { contentList, bottomPopup, handleBottomPopup, setIsPopupTouch } =
    props;
  const [swipeList, setSwipeList] = useState<SwipeList[]>([]);
  const scrollRef: any = useRef([]);
  const halfWidth = Math.floor(Dimensions.get('screen').width / 2);

  useEffect(() => {
    let userList = contentList.slice(0);
    userList.forEach(list => {
      list.direction = 'NONE';
    });

    setSwipeList(userList);
  }, [contentList]);

  const fadeInValue = new Animated.Value(0);

  const fadeInAnimated = () => {
    Animated.timing(fadeInValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const handelProfileTouch = (item: ParticipantsTypes) => {
    let userList = contentList.slice(0);
    const findUser = userList.find(user => user.id === item.id);

    if (findUser) {
      handleBottomPopup({
        ...bottomPopup,
        contentList: findUser,
        title: t('프로필'),
        popupType: 'PROFILE'
      });
    } else {
      console.log('찾을수 없음');
    }
  };

  const onHandleSwipe = (
    nativeEvent: NativeScrollEvent,
    index: number
  ) => {

    console.log(11111);
    console.log(nativeEvent);
    
    const direction = nativeEvent.contentOffset.x;

    let directionList: SwipeList[] = contentList;
    let bfDirection = directionList[index].direction;
    const resList: SwipeList[] = [];

    const beforeEvent = bfDirection === 'NONE' ? false : true;

    if (beforeEvent) return false;
    else {
      if (direction > 0) directionList[index].direction = 'RIGHT';
      else directionList[index].direction = 'LEFT';

      directionList.map(v => resList.push(v));
      setSwipeList(resList);
    }
  };

  const onHandelResetSwipe = (e: GestureResponderEvent, index: number) => {
    let directionList: SwipeList[] = contentList;
    const resList: SwipeList[] = [];
    directionList[index].direction = 'NONE';
    directionList.map(v => resList.push(v));
    setSwipeList(resList);
    setIsPopupTouch(false);
  };

  return (
    <UserListPresenter
      scrollRef={scrollRef}
      fadeInValue={fadeInValue}
      fadeInAnimated={fadeInAnimated}
      onHandleSwipe={onHandleSwipe}
      onHandelResetSwipe={onHandelResetSwipe}
      swipeList={swipeList}
      handelProfileTouch={handelProfileTouch}
    />
  );
};
export default UserListContainer;
