import { getT } from '@utils/translateManager';
import _ from 'lodash';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RequestMessagesProps } from '../types';

const RequestMessages: React.FC<RequestMessagesProps> = ({
  insets,
  userList
}) => {
  const t = getT();
  return (
    <FlatList
      style={[styles.userListView, { top: insets.top + 100 }]}
      scrollEnabled={userList.length > 2}
      data={userList}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <View style={styles.requestView}>
            <View style={{ alignItems: 'flex-start', marginRight: 30 }}>
              <Text style={styles.requestTitle}>{t('발언권 요청')}</Text>
              <Text
                style={styles.requestContent}
              >{`${item.name} 님이 발언권을 요청하였습니다.`}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={_.throttle(() => {}, 750)}
                // onPress={_.throttle(() => replyUserRequest(targetUser, true), 750)}
              >
                <Text style={styles.buttonText}>{t('수락')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.denyButton}
                onPress={_.throttle(() => {}, 750)}
                // onPress={_.throttle(() => replyUserRequest(targetUser, false), 750)}
              >
                <Text style={styles.buttonText}>{t('거부')}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    elevation: 4,
    zIndex: 4
  },
  requestView: {
    width: '100%',
    height: 64.5,
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(43,48,58)',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  requestTitle: {
    color: '#fff',
    fontFamily: 'DOUZONEText50',
    fontSize: 13,
    marginBottom: 7.5
  },
  requestContent: {
    color: '#fff',
    fontFamily: 'DOUZONEText30',
    fontSize: 12
  },
  acceptButton: {
    backgroundColor: '#1c90fb',
    width: 53.5,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  denyButton: {
    backgroundColor: '#fc5356',
    width: 53.5,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff'
  }
});

export default RequestMessages;
