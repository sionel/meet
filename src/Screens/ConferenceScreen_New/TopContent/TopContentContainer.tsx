import { View, Text } from 'react-native';
import React from 'react';
import { TopContentContainerProps } from '../types';
import TopContentPresenter from './TopContentPresenter';

const TopContentContainer: React.FC<TopContentContainerProps> = ({
  insets
}) => {
  const _handleUserList = () => {};
  const _handleChatting = () => {};
  const _handleReverseCamara = () => {};
  const _handleDisplayInvert = () => {};
  const _handleMore = () => {};
  return (
    <TopContentPresenter
      insets={insets}
      isMaster={true}
      UserListClick={_handleUserList}
      ChattingClick={_handleChatting}
      ReverseCamaraClick={_handleReverseCamara}
      DisplayInvertClick={_handleDisplayInvert}
      MoreClick={_handleMore}
    />
  );
};

export default TopContentContainer;
