import React from 'react';
import { BottomContentContainerProps } from '../types';
import BottomContentPresenter from './BottomContentPresenter';

const BottomContentContainer: React.FC<BottomContentContainerProps> = ({
  handleCloseConf
}) => {
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
