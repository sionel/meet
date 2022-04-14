import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomContentContainerProps } from '../types';
import BottomContentPresenter from './BottomContentPresenter';

const BottomContentContainer: React.FC<BottomContentContainerProps> = ({
  handleCloseConf
}) => {
  const insets = useSafeAreaInsets();
  const _handleSpeakerClick = () => {};
  const _handleMikeClick = () => {};
  const _handleVideoClick = () => {};

  return (
    <BottomContentPresenter
      insets={insets}
      ToggleSpeakerClick={_handleSpeakerClick}
      ToggleMikeClick={_handleMikeClick}
      ToggleVideoClick={_handleVideoClick}
      EndCallClick={handleCloseConf}
    />
  );
};
export default BottomContentContainer;
