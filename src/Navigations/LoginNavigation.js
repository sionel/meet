import React from 'react';

// import { createAppContainer, createStackNavigator } from 'react-navigation';
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
