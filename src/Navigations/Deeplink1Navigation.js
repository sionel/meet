
import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import ConferenceScreen from '../Screens/ConferenceScreen';
import SettingScreen from '../Screens/SettingScreen';
import { Image, TouchableOpacity } from 'react-native';
import RouteTitle from '../Routes/RouteTitle';

const commonStyle = {
  height: 53,
  color: '#fff',
  backgroundColor: '#1C90FB'
};
const backBtn = require('../../assets/buttons/back_btn.png');


const BackButton = ({ navigation, to }) => {
  return (
    <TouchableOpacity
      onPress={() => {
          // TODO: 로그인으로 가야하는데 그걸 메인 컨테이너에서 처리 할거니깐 거기로 컴바인!
        navigation.navigate(to);
      }}
    >
      <Image
        source={backBtn}
        style={{ width: 23, height: 20, marginLeft: 20 }}
      />
    </TouchableOpacity>
  );
};

const Deeplink1Navigation = createStackNavigator(
  {
    Setting: {
      screen: SettingScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={'기본 설정'} />,
        headerLeft: <BackButton navigation={navigation} to={'Main'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    Conference: {
      screen: ConferenceScreen,
      navigationOptions: {
        header: null,
        headerLeft: null,
        gesturesEnabled: false
      }
    },
  },
  {
    initialRouteName: 'Setting',
    mode: 'modal',
    headerMode: 'screen',
    cardStyle: { backgroundColor: '#FFF', transparent: true }
  }
);

export default createAppContainer(Deeplink1Navigation);
