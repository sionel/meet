/**
 * CreateRoute
 *
 */

import { createStackNavigator, createAppContainer } from 'react-navigation';
// import LoginScreen from '../Screens/LoginScreen';
import LoginScreenPresenter from '../Screens/LoginScreen';
import LoginInputScreen from '../Screens/LoginScreen/LoginInputScreen';

// 메인화면
export const LoginMain = createStackNavigator(
  {
    LoginMain: LoginScreenPresenter, // 메인 화면
    // LoginInput: LoginInputScreen // ID, PW 입력 화면
  },
  Object.assign(
    {},
    {
      initialRouteName: 'LoginMain',
      transparentCard: true,
      mode: 'card',
      headerMode: 'none'
    }
  )
);

export default createAppContainer(
  createStackNavigator(
    {
      Login: LoginMain
    },
    {
      initialRouteName: 'Login',
      headerMode: 'none'
    }
  )
);
