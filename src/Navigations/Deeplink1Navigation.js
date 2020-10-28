import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import ConferenceStateScreen from '../Screens/ConferenceStateScreen';
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

const BackButton = ({ navigation }) => {
  const { onChangeRootState, from } = navigation.getScreenProps();

  return (
    <TouchableOpacity
      onPress={() => {
        onChangeRootState({
          destination: from === 'this' || from === 'mobile' ? 'List' : 'Login'
        });
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
    ConferenceState: {
      screen: ConferenceStateScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={'화상 회의'} />,
        headerLeft: <BackButton navigation={navigation} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    Setting: {
      screen: SettingScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={'기본 설정'} />,
        headerLeft: <BackButton navigation={navigation} />,
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
    }
  },
  {
    initialRouteName: 'ConferenceState',
    mode: 'modal',
    headerMode: 'screen',
    cardStyle: { backgroundColor: '#FFF', transparent: true }
  }
);

export default createAppContainer(Deeplink1Navigation);
