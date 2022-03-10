import { ParticipantsTypes } from '@redux/participants';
import { ConferenceBottomPopupProps } from '@screens/ConferenceScreen/Content/ContentContainer';
import { getT } from '@utils/translateManager';
import React, { MutableRefObject, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import UserListPresenter from './UserListPresenter';

type UserListContainer = {
  contentList: ParticipantsTypes[];
  bottomPopup: ConferenceBottomPopupProps;
  handleBottomPopup: React.Dispatch<
    React.SetStateAction<ConferenceBottomPopupProps>
  >;
  setIsPopupTouch: React.Dispatch<React.SetStateAction<boolean>>;
  handleKickUser: (id: string, masterName: string, userName: string) => void;
};

export const UserListContainer = (props: UserListContainer) => {
  const t = getT();
  const {
    contentList,
    bottomPopup,
    handleBottomPopup,
    setIsPopupTouch,
    handleKickUser
  } = props;

  const [isRoomMaster, setIsRoomMaster] = useState(false);
  const swipeRef: MutableRefObject<any> = React.useRef([]);

  const { isMasterControl, masters, authID, authName } = useSelector(
    (state: RootState) => {
      const { master, user } = state;
      return {
        isMasterControl: master.isMasterControl,
        masters: master.masterList,
        authID: user.auth.portal_id,
        authName: user.auth.user_name
      };
    }
  );

  useEffect(() => {
    let master = masters.find(id => id === authID);
    setIsRoomMaster(master ? true : false);
    return () => {};
  });

  const handelProfileTouch = (item: ParticipantsTypes) => {
    let newUserList = contentList.slice(0);
    const findUser = newUserList.find(user => user.id === item.id);
    if (findUser) {
      handleBottomPopup({
        ...bottomPopup,
        contentList: findUser,
        title: t('프로필'),
        popupType: 'PROFILE'
      });
    } else {
      console.log('해당 유저의 프로필 정보를 찾을수 없음');
    }
  };

  const _handleKickUser = (id: string, userName: string) => {
    handleKickUser(id, authName, userName);
    // let newUserList = contentList.slice(0);
    // const findUser = newUserList.filter(user => user.id !== id);
    // handleBottomPopup({ ...bottomPopup, contentList: findUser });
  };

  return (
    <UserListPresenter
      userList={contentList}
      isMasterControl={isMasterControl}
      swipeRef={swipeRef}
      handelProfileTouch={handelProfileTouch}
      handleKickUser={_handleKickUser}
      isRoomMaster={isRoomMaster}
      authName={authName}
    />
  );
};
export default UserListContainer;
