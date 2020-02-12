import { createAppContainer, createStackNavigator } from 'react-navigation';
import LoginScreen from '../Screens/LoginScreen';
import LoginInputScreen from '../Screens/LoginScreen/LoginInputScreen';

/**
 * LoginNavigation
 */
const LoginNavigation = createStackNavigator(
  {
    /**
     * Main Navigation
     */
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    LoginInput: {
      screen: LoginInputScreen,
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
      defaultNavigationOptions: {
        // gesturesEnabled: Platform.OS === 'ios' ? true : false
      }
    }
  )
);
