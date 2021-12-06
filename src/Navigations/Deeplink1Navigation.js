import React from 'react';
// import { createAppContainer, createStackNavigator } from 'react-navigation';
import ConferenceStateScreen from '../Screens/ConferenceStateScreen';
import ConferenceScreen from '../Screens/ConferenceScreen';
import SettingScreen from '../Screens/SettingScreen';
import { Image, TouchableOpacity } from 'react-native';
import RouteTitle from '../Routes/RouteTitle';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as RootActions } from '../redux/modules/root';

const commonStyle = {
  height: 53,
  color: '#fff',
  backgroundColor: '#1C90FB',
};
const backBtn = require('../../assets/buttons/back_btn.png');

const BackButton = () => {
  const dispatch = useDispatch();
  const _setDestination = destination =>
    dispatch(RootActions.setDestination(destination));

  const { destination, isLogin } = useSelector((state) => {
    return {
      destination: state.root.destination,
      isLogin: state.user.isLogin
    }
  });
  
  return (
    <TouchableOpacity
      onPress={() => {
        _setDestination(
          (destination === 'Conference' || destination === 'Setting') && isLogin
            ? 'List'
            : 'Login'
        );
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
        headerTitle: (
          <RouteTitle
            title={navigation.getScreenProps().t('renewal.option_conference')}
          />
        ),
        headerLeft: <BackButton navigation={navigation} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    
    Setting: {
      screen: SettingScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle
            title={navigation.getScreenProps().t('renewal.roomstate_setting_header')}
          />
        ),
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
