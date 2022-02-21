import { ParticipantsTypes } from '@redux/participants';
import { ConferenceBottomPopupProps } from '@screens/ConferenceScreen/Content/ContentContainer';
import React, { useEffect } from 'react';
import ProfilePresenter from './ProfilePresenter';

type ProfileContainer = {
  content: ParticipantsTypes;
};

const ProfileContainer = (props: ProfileContainer) => {
  const { content } = props;

  return <ProfilePresenter content={content} />;
};

export default ProfileContainer;
