import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  Text
} from 'react-native';

import { CustomIcon } from '../../components';

export default function OpenSourceScreen(props) {
  const config = [
    {
      title: '@react-native-community/async-storage',
      action: () =>
        Linking.openURL(
          'https://github.com/react-native-community/async-storage'
        )
    },
    {
      title: '@react-native-community/slider',
      action: () =>
        Linking.openURL('https://github.com/react-native-community/slider')
    },
    {
      title: '@terrylinla/react-native-sketch-canvas',
      action: () =>
        Linking.openURL(
          'https://github.com/terrylinla/react-native-sketch-canvas'
        )
    },
    {
      title: 'crypto-js',
      action: () => Linking.openURL('http://github.com/brix/crypto-js')
    },
    {
      title: 'jitsi-meet',
      action: () => Linking.openURL('https://github.com/jitsi/jitsi-meet')
    },
    {
      title: 'lottie-ios',
      action: () => Linking.openURL('https://github.com/airbnb/lottie-ios')
    },
    {
      title: 'lottie-react-native',
      action: () =>
        Linking.openURL(
          'https://github.com/react-native-community/lottie-react-native'
        )
    },
    {
      title: 'react',
      action: () => Linking.openURL('https://github.com/facebook/react')
    },
    {
      title: 'react-native',
      action: () => Linking.openURL('https://github.com/facebook/react-native')
    },
    {
      title: 'react-native-app-intro-slider',
      action: () =>
        Linking.openURL(
          'https://github.com/jacse/react-native-app-intro-slider'
        )
    },
    {
      title: 'react-native-cancelable-fetch',
      action: () =>
        Linking.openURL(
          'https://github.com/apentle/react-native-cancelable-fetch'
        )
    },
    {
      title: 'react-native-device-info',
      action: () =>
        Linking.openURL(
          'https://github.com/react-native-community/react-native-device-info'
        )
    },
    {
      title: 'react-native-fast-image',
      action: () =>
        Linking.openURL('https://github.com/DylanVann/react-native-fast-image')
    },
    {
      title: 'react-native-gesture-handler',
      action: () =>
        Linking.openURL(
          'https://github.com/software-mansion/react-native-gesture-handler'
        )
    },
    {
      title: 'react-native-home-indicator',
      action: () =>
        Linking.openURL(
          'https://github.com/flowkey/react-native-home-indicator'
        )
    },
    {
      title: 'react-native-home-pressed',
      action: () =>
        Linking.openURL('https://github.com/evanjmg/react-native-home-pressed')
    },
    {
      title: 'react-native-orientation-locker',
      action: () =>
        Linking.openURL(
          'https://github.com/wonday/react-native-orientation-locker'
        )
    },
    {
      title: 'react-native-permissions',
      action: () =>
        Linking.openURL(
          'https://github.com/react-native-community/react-native-permissions'
        )
    },
    {
      title: 'react-native-picker-select',
      action: () =>
        Linking.openURL(
          'https://github.com/lawnstarter/react-native-picker-select'
        )
    },
    {
      title: 'react-native-reanimated',
      action: () =>
        Linking.openURL('https://github.com/kmagiera/react-native-reanimated')
    },
    {
      title: 'react-native-splash-screen',
      action: () =>
        Linking.openURL(
          'https://github.com/crazycodeboy/react-native-splash-screen'
        )
    },
    {
      title: 'react-native-vector-icons',
      action: () =>
        Linking.openURL('https://github.com/oblador/react-native-vector-icons')
    },
    {
      title: 'react-textarea-autosize',
      action: () =>
        Linking.openURL('https://github.com/andreypopp/react-textarea-autosize')
    },
    {
      title: 'redux-persist',
      action: () => Linking.openURL('https://github.com/rt2zz/redux-persist')
    },
    {
      title: 'redux-thunk',
      action: () => Linking.openURL('https://github.com/reduxjs/redux-thunk')
    },
    {
      title: 'underscore',
      action: () => Linking.openURL('https://github.com/jashkenas/underscore')
    },
    {
      title: 'uuid',
      action: () => Linking.openURL('https://github.com/kelektiv/node-uuid')
    }
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#ececec'
        }}
      >
        <Text style={{ fontFamily: 'DOUZONEText50', color: '#666' }}>
          THE FOLLOWING SETS FORTH ATTRIBUTION NOTICES FOR THIRD PARTY SOFTWARE
          THAT MAY BE CONTAINED IN THIS APPLICATION.
        </Text>
      </View>

      <FlatList
        data={config}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={item.action}
            style={styles.columnContainer}
          >
            <Text
              style={{
                flex: 1,
                fontFamily: 'DOUZONEText30',
                marginHorizontal: 5
              }}
            >
              {item.title}
            </Text>
            <CustomIcon name={'btn_next'} width={24} height={24} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

OpenSourceScreen.defaultProps = {};

const styles = StyleSheet.create({
  container: { flex: 1 },
  columnContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    paddingHorizontal: 10
  }
});
