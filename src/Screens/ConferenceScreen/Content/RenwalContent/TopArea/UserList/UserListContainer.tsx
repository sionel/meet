import { ParticipantsTypes } from '@redux/participants';
import React, { Component, useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import UserListPresenter from './UserListPresenter';

type SwipeList = ParticipantsTypes;
type UserListContainer = {
  contentList: ParticipantsTypes[];
};

export const UserListContainer = (props: UserListContainer) => {
  const { contentList } = props;
  const [swipeList, setSwipeList] = useState<SwipeList[]>([]);
  const scrollRef: any = useRef([]);

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
      duration: 50,
      useNativeDriver: true
    }).start();
  };

  const onHandleSwipe = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    index: number
  ) => {
    const direction = event.nativeEvent.contentOffset.x;

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
  };

  return (
    <UserListPresenter
      scrollRef={scrollRef}
      fadeInValue={fadeInValue}
      fadeInAnimated={fadeInAnimated}
      onHandleSwipe={onHandleSwipe}
      onHandelResetSwipe={onHandelResetSwipe}
      swipeList={swipeList}
    />
  );
};
export default UserListContainer;
