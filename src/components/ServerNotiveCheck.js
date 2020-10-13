import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity
} from 'react-native';
import RNRestart from 'react-native-restart';

import { Text } from '../components/StyledText';
import CustomIcon from './CustomIcon';

export default function ServerNotiveCheck({ message }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.title}>
          <CustomIcon name={'ico_setting_160'} size={32} />
          <Text style={styles.titleText}>{message.title}</Text>
        </View>

        <View style={styles.divider} />

        <ScrollView bounces={false}>
          <View style={styles.body}>
            <Text style={{ lineHeight: 24, fontSize: 14 }}>{message.body}</Text>
          </View>
        </ScrollView>

        <View style={styles.divider} />

        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => RNRestart.Restart()}
            style={styles.bottomButton}
          >
            <Text style={styles.bottomButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

ServerNotiveCheck.defaultProps = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  modalContainer: {
    width: '80%',
    maxWidth: 360,
    height: '80%',
    maxHeight: 500,
    backgroundColor: '#fff',
    paddingHorizontal: 24
  },
  title: {
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    marginLeft: 6,
    fontSize: 16.5
  },
  body: {
    flex: 1,
    paddingVertical: 24
  },
  bottom: {},
  bottomButton: {
    paddingVertical: 24
  },
  bottomButtonText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#1C90FB'
  }
});
