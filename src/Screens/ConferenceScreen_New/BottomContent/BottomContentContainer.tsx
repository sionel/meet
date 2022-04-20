import React from 'react';
import { BottomContentContainerProps } from '../types';
import BottomContentPresenter from './BottomContentPresenter';

const BottomContentContainer: React.FC<BottomContentContainerProps> = ({
  handleCloseConf
}) => {
  const _handlePressSpeaker = () => {};
  const _handlePressMike = () => {};
  const _handlePressVideo = () => {};

  return (
    <BottomContentPresenter
    onPressSpeaker={_handlePressSpeaker}
    onPressMike={_handlePressMike}
    onPressVideo={_handlePressVideo}
    onPressEndCall={handleCloseConf}
    />
  );
};
export default BottomContentContainer;
