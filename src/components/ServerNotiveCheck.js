import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  CheckBox
} from 'react-native';
import RNRestart from 'react-native-restart';

import { Text } from '../components/StyledText';
import CustomIcon from './CustomIcon';

export default function ServerNotiveCheck({ servernoti }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.title}>
          <CustomIcon name={'ico_setting_160'} size={32} />
          <Text style={styles.titleText}>{servernoti.title}</Text>
        </View>

        <View style={styles.divider} />

        <ScrollView bounces={false} showsVerticalScrollIndicator={true}>
          <View style={styles.body}>
            <Text style={{ lineHeight: 24, fontSize: 14 }}>
              {servernoti.message}
            </Text>
          </View>
          {servernoti.subMessage && servernoti.subMessage.length > 0 && (
            <View style={styles.subMessage}>
              <Text style={{ paddingBottom: 10 }}>{'[업데이트 내역]'}</Text>
              {servernoti.subMessage.map((e, idx) => {
                return (
                  <View key={idx} style={{ paddingHorizontal: 10 }}>
                    <Text
                      style={{
                        lineHeight: 24,
                        fontSize: 14,
                        paddingVertical: 5
                      }}
                    >{`${idx + 1}.  ${e}`}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        <View style={styles.divider} />

        <View style={styles.bottom}>
          {servernoti.buttons.map((e, idx) => (
            <TouchableOpacity
              onPress={e.onclick}
              style={styles.bottomButton}
              key={idx}
            >
              <Text style={styles.bottomButtonText}>{e.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* {servernoti.type === 'update' && (
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <CheckBox
              // onValueChange={servernoti.onToggle}
              onValueChange={() => {
                debugger;
              }}
              style={{
                alignSelf: 'center',
                width: 30,
                height: 30
              }}
              value={servernoti.buttonValue}
            ></CheckBox>
          </View>
        )} */}
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
    height: '60%',
    maxHeight: 400,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    borderRadius: 20
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
    paddingVertical: 15
    // backgroundColor: '#0f0'
  },
  subMessage: {
    flex: 1,
    paddingVertical: 5
    // backgroundColor: '#f00'
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  bottomButton: {
    paddingVertical: 24
  },
  bottomButtonText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#1C90FB'
  }
});
