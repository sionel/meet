import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MessagesCardProps } from '@screens/ConferenceScreen/types';
import _ from 'lodash';

const MessagesCard: React.FC<MessagesCardProps> = ({requestUser, replyUserRequest, t}) => {

  return (
    <View style={styles.requestView}>
      <View style={{ alignItems: 'flex-start', marginRight: 30 }}>
        <Text style={styles.requestTitle}>{t('발언권 요청')}</Text>
        <Text
          style={styles.requestContent}
        >{`${requestUser.name} 님이 발언권을 요청하였습니다.`}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={_.throttle(() => replyUserRequest(requestUser, true), 750)}
        >
          <Text style={styles.buttonText}>{t('수락')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.denyButton}
          onPress={_.throttle(() => replyUserRequest(requestUser, false), 750)}
        >
          <Text style={styles.buttonText}>{t('거부')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessagesCard;

const styles = StyleSheet.create({
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
