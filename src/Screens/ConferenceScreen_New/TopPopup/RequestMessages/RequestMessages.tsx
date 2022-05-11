import { requestUser } from '@redux/master';
import { getT } from '@utils/translateManager';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { RequestMessagesProps } from '../../types';
import MessagesCard from './MessagesCard';

const RequestMessages: React.FC<RequestMessagesProps> = ({
  requestUserList
}) => {
  const { t } = useTranslation();
  const { room } = useSelector((state: RootState) => ({
    room: state.conference.room
  }));
  const replyUserRequest = (requestUser: requestUser, command: boolean) => {
    room && room.sendMessage.replyUserRequest(requestUser, command);
  };
  return (
    <FlatList
      style={styles.userListView}
      scrollEnabled={requestUserList.length > 2}
      data={requestUserList}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        return ( <MessagesCard requestUser={item} replyUserRequest={replyUserRequest} t={t} />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  userListView: {
    position: 'absolute',
    flex: 1,
    minHeight: 64.5,
    maxHeight: 258,
    left: 16,
    right: 16,
    // elevation: 4,
    top: 150,
    zIndex: 4
  }
});

export default RequestMessages;
