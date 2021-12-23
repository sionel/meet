import React, { Component } from 'react';
import UserListPresenter from './UserListPresenter';

export default class UserListContainer extends Component {
  render() {
    const {
      auth,
      user,
      users,
      attributes,
      presenter,
      speaker,
      toggleMuteMic,
      onChangeSpeaker,
      // updateMuteAudio
      masters
    } = this.props;

    let userList = users.slice(0);
    userList.unshift({
      ...user,
      userInfo: {
        profile_url: auth.profile_url,
        wehagoId: auth.portal_id,
        userName: auth.user_name,
        nickname: auth.nickname
      }
    });

    userList.forEach(user => {
      user.isMaster = masters.includes(user?.userInfo?.wehagoId);
    });

    // const scrollRef: any = useRef([]);

    // const fadeInValue = new Animated.Value(0);

    // const fadeInAnimated = () => {
    //   Animated.timing(fadeInValue, {
    //     toValue: 1,
    //     duration: 50,
    //     useNativeDriver: true
    //   }).start();
    // };

    // const onHandleSwipe = (
    //   event: NativeSyntheticEvent<NativeScrollEvent>,
    //   index: number
    // ) => {
    //   const direction = event.nativeEvent.contentOffset.x;
  
    //   let directionList: any[] = selectedEmployee.member;
    //   let bfDirection = directionList[index].direction;
    //   const resList: any[] = [];
  
    //   const beforeEvent = bfDirection === 'NONE' ? false : true;
  
    //   if (beforeEvent) return false;
    //   else {
    //     if (direction > 0) directionList[index].direction = 'RIGHT';
    //     else directionList[index].direction = 'LEFT';
  
    //     directionList.map(v => resList.push(v));
    //     setSelectedEmployee({ member: resList, group: {} });
    //   }
    // };
  
    // const onHandelResetSwipe = (e: GestureResponderEvent, index: number) => {
    //   let directionList: any[] = selectedEmployee.member;
    //   const resList: any[] = [];
    //   directionList[index].direction = 'NONE';
    //   directionList.map(v => resList.push(v));
    //   setSelectedEmployee({ member: resList, group: {} });
    // };

    return (
      <UserListPresenter
        userList={userList}
        presenter={presenter}
        speaker={speaker}
        toggleMuteMic={toggleMuteMic}
        onChangeSpeaker={onChangeSpeaker}
        masters={masters}
        // updateMuteAudio={updateMuteAudio}
      />
    );
  }
}



