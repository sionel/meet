import React from 'react';
import { TopPopupPresenterProps } from '../types';
import _ from 'lodash';
import RequestMessages from './RequestMessages/RequestMessages';
import ToastMessage from './ToastMessage';

const TopPopupPresenter: React.FC<TopPopupPresenterProps> = ({
  requestUserList,
  message,
  fadeAnimation,
  isMaster
}) => {
  return requestUserList.length > 0 && isMaster ? (
    <RequestMessages requestUserList={requestUserList} />
  ) : message ?  (
    <ToastMessage  message={message} fadeAnimation={fadeAnimation} />
  ) : null;
};

export default TopPopupPresenter;
