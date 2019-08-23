/**
 * CustomWebView
 */

import React from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
// import WebView from 'react-native-yunpeng-webview';
const WebView =
  Platform.OS === 'ios'
    ? require('react-native').WebView
    : require('react-native-webview').WebView;

const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

const CustomWebView = props => {
  const {
    icon,
    contentTitle,
    buttonTitle,
    url,
    headerStyle,
    titleStyle,
    contentStyle,
    onClickButton
  } = props;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: '100%',
          height: 54 + (hasNotch ? 24 : 0) + (Platform.OS === 'ios' ? 12 : 0),
          paddingBottom: 12,
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: '#1C90FB',
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'row',
          boxShadow: '0 1 0 1 rgba(0,0,0, .5)',
          ...headerStyle
        }}
      >
        <Icon
          name={icon}
          size={17}
          color="#fff"
          style={{ marginRight: 5, opacity: 0.85 }}
        />
        <Text
          style={{
            color: '#fff',
            flex: 2,
            fontSize: 17,
            textAlign: 'left',
            fontWeight: 'bold',
            fontFamily: Platform.OS === 'ios' ? 'NanumSquareEB' : 'normal',
            ...titleStyle
          }}
        >
          {contentTitle}
        </Text>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClickButton}>
          <Text style={{ color: '#fff', fontSize: 17, textAlign: 'right', fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal' }}>
            {buttonTitle}
          </Text>
        </TouchableOpacity>
      </View>
      <WebView source={{ uri: url }} style={{ ...contentStyle }} />
    </View>
  );
};

CustomWebView.defaultProps = {
  icon: 'globe',
  contentTitle: '웹페이지',
  buttonTitle: '확인',
  url: 'https://www.wehago.com/#/',
  headerStyle: {},
  titleStyle: {},
  contentStyle: {},
  onClickButton: () => {
    console.log('on Click');
  }
};

export default CustomWebView;
