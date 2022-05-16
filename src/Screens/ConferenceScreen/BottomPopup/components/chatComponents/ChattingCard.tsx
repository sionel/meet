import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ChattingCardProps } from '@screens/ConferenceScreen/types';

const ChattingCard: React.FC<ChattingCardProps> = ({
  isLocalUser,
  profileUrl,
  text,
  userName
}) => {
  return (
    <View style={styles.chatContainer}>
      <View
        style={[
          styles.normalChatView,
          isLocalUser && { backgroundColor: '#1c90fb' }
        ]}
      >
        <View style={styles.chatProfileView}>
          <Image
            source={{ uri: profileUrl }}
            style={styles.chatProfile}
            resizeMode="cover"
          />
        </View>
        <View style={styles.chatTextView}>
          <Text style={styles.userName}>
            {userName}
            {isLocalUser && `(나)`}
          </Text>

          <Text style={styles.chatText}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChattingCard;

const styles = StyleSheet.create({
  chatContainer: {
    alignItems: 'flex-start',
    marginBottom: 5,
    width: '90%'
  },
  normalChatView: {
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  chatProfileView: {
    marginLeft: 16,
    marginRight: 8,
    marginVertical: 8
  },
  chatProfile: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  userName: {
    fontFamily: 'DOUZONEText50',
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)'
  },
  chatTextView: {
    marginVertical: 8,
    paddingRight: 16,
    maxWidth: '90%'
  },
  chatText: {
    fontFamily: 'DOUZONEText30',
    fontSize: 12,
    color: 'rgba(255,255,255,0.87)',
    flex: 1
  }
});
