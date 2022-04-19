import React from 'react';
import { TopPopupPresenterProps } from '../types';
import _ from 'lodash';
import RequestMessages from './RequestMessages';
import ToastMessage from './ToastMessage';

const TopPopupPresenter: React.FC<TopPopupPresenterProps> = ({
  userList,
  message,
  fadeAnimation
}) => {
  return userList.length > 0 ? (
    <RequestMessages  userList={userList} />
  ) : message ?  (
    <ToastMessage  message={message} fadeAnimation={fadeAnimation} />
  ) : null;
};

export default TopPopupPresenter;
