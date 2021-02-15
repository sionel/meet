import React from 'react';

import { createAppContainer, createStackNavigator } from 'react-navigation';
import LoginInputScreen from '../Screens/LoginScreen/LoginInputScreen';
import LoginScreen from '../Screens/LoginScreen';

/**
 * LoginNavigation
 */
const LoginNavigation = createStackNavigator(
  {
    /**
     * Main Navigation
     */
    Login: {
      screen: props => {
        return (
          <LoginScreen
            onChangeRootState={props.screenProps.onChangeRootState}
            onChangeMainState={props.screenProps.onChangeMainState}
            navigation={props.navigation}
          />
        );
      },
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    LoginInput: {
      screen: props => {
        return (
          <LoginInputScreen
            onChangeRootState={props.screenProps.onChangeRootState}
            onChangeMainState={props.screenProps.onChangeMainState}
            navigation={props.navigation}
          />
        );
      },
      navigationOptions: {
        header: null,
        gesturesEnabled: true
      }
    }
  },
  // initial
  {
    initialRouteName: 'Login',
    mode: 'card',
    headerMode: 'none',
    cardStyle: { backgroundColor: '#FFF', transparent: true }
  }
);

export default createAppContainer(
  createStackNavigator(
    {
      Login: LoginNavigation
    },
    {
      initialRouteName: 'Login',
      headerMode: 'none',
      defaultNavigationOptions: {}
    }
  )
);
