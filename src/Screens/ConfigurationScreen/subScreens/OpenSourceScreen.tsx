import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Text
} from 'react-native';

import { CustomIcon } from '@components/index';

export default function OpenSourceScreen(props: any) {
  const config = [
    {
      title: '@react-native-community/async-storage',
      url: 'https://github.com/react-native-community/async-storage'
    },
    {
      title: '@react-native-community/slider',
      url: 'https://github.com/react-native-community/react-native-slider'
    },
    {
      title: '@terrylinla/react-native-sketch-canvas',
      url: 'https://github.com/terrylinla/react-native-sketch-canvas'
    },
    {
      title: 'crypto-js',
      url: 'http://github.com/brix/crypto-js'
    },
    {
      title: 'jitsi-meet',
      url: 'https://github.com/jitsi/jitsi-meet'
    },
    {
      title: 'lottie-ios',
      url: 'https://github.com/airbnb/lottie-ios'
    },
    {
      title: 'lottie-react-native',
      url: 'https://github.com/react-native-community/lottie-react-native'
    },
    {
      title: 'react',
      url: 'https://github.com/facebook/react'
    },
    {
      title: 'react-native',
      url: 'https://github.com/facebook/react-native'
    },
    {
      title: 'react-native-app-intro-slider',
      url: 'https://github.com/jacse/react-native-app-intro-slider'
    },
    {
      title: 'react-native-cancelable-fetch',
      url: 'https://github.com/apentle/react-native-cancelable-fetch'
    },
    {
      title: 'react-native-device-info',
      url: 'https://github.com/react-native-community/react-native-device-info'
    },
    {
      title: 'react-native-fast-image',
      url: 'https://github.com/DylanVann/react-native-fast-image'
    },
    {
      title: 'react-native-gesture-handler',
      url: 'https://github.com/software-mansion/react-native-gesture-handler'
    },
    {
      title: 'react-native-home-indicator',
      url: 'https://github.com/flowkey/react-native-home-indicator'
    },
    {
      title: 'react-native-home-pressed',
      url: 'https://github.com/evanjmg/react-native-home-pressed'
    },
    {
      title: 'react-native-orientation-locker',
      url: 'https://github.com/wonday/react-native-orientation-locker'
    },
    {
      title: 'react-native-permissions',
      url: 'https://github.com/react-native-community/react-native-permissions'
    },
    {
      title: 'react-native-picker-select',
      url: 'https://github.com/lawnstarter/react-native-picker-select'
    },
    {
      title: 'react-native-reanimated',
      url: 'https://github.com/kmagiera/react-native-reanimated'
    },
    {
      title: 'react-native-splash-screen',
      url: 'https://github.com/crazycodeboy/react-native-splash-screen'
    },
    {
      title: 'react-native-vector-icons',
      url: 'https://github.com/oblador/react-native-vector-icons'
    },
    {
      title: 'react-textarea-autosize',
      url: 'https://github.com/andreypopp/react-textarea-autosize'
    },
    {
      title: 'redux-persist',
      url: 'https://github.com/rt2zz/redux-persist'
    },
    {
      title: 'redux-thunk',
      url: 'https://github.com/reduxjs/redux-thunk'
    },
    {
      title: 'underscore',
      url: 'https://github.com/jashkenas/underscore'
    },
    {
      title: 'uuid',
      url: 'https://github.com/kelektiv/node-uuid'
    }
  ];

  const ListHeaderComponent = (
    <View
      style={{
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ececec'
      }}
    >
      <Text
        style={{
          fontFamily: 'DOUZONEText50',
          color: '#666',
          fontSize: 16
        }}
      >
        THE FOLLOWING SETS FORTH ATTRIBUTION NOTICES FOR THIRD PARTY SOFTWARE
        THAT MAY BE CONTAINED IN THIS APPLICATION.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={config}
        keyExtractor={item => item.title}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              props.navigation.navigate({
                routeName: 'OpenSourceDetail',
                params: { url: item.url }
              });
            }}
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
