import { View, Text } from 'react-native';
import React from 'react';
import BottomContentPresenter from './BottomContentPresenter';
import { BottomContentContainerProps } from '../types';

const BottomContentContainer: React.FC<BottomContentContainerProps> = props => {
  const { handleCloseConf } = props;

  const _handleSpeakerClick = () => {};
  const _handleMikeClick = () => {};
  const _handleVideoClick = () => {};

  return (
    <BottomContentPresenter
      ToggleSpeakerClick={_handleSpeakerClick}
      ToggleMikeClick={_handleMikeClick}
      ToggleVideoClick={_handleVideoClick}
      EndCallClick={handleCloseConf}
    />
  );
};
export default BottomContentContainer;
