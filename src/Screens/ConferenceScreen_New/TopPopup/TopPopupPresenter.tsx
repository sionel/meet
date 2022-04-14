import React from 'react';
import { TopPopupPresenterProps } from '../types';
import _ from 'lodash';
import RequestMessages from './RequestMessages';
import ToastMessage from './ToastMessage';

const TopPopupPresenter: React.FC<TopPopupPresenterProps> = ({
  userList,
  insets,
  message,
  fadeAnimation
}) => {
  return userList.length > 0 ? (
    <RequestMessages insets={insets} userList={userList} />
  ) : message ?  (
    <ToastMessage insets={insets} message={message} fadeAnimation={fadeAnimation} />
  ) : null;
};

export default TopPopupPresenter;
