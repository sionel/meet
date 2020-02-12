import React from 'React';
import { Platform } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
// import LoginScreen from '../Screens/LoginScreen';
// import LoginInputScreen from '../Screens/LoginScreen/LoginInputScreen';
import { LoginScreen, LoginInputScreen } from 'rn-component';

const Login = props => (
  <LoginScreen
    service={Platform.OS === 'ios' ? 'meet' : 'MeetLogin'}
    text1={'시간과 장소의 제약 없는\n효율적인 화상회의'}
    text2={'WEHAGO Meet'}
    onManualLogin={() => props.navigation.navigate('LoginInput')}
  />
);
const LoginInput = props => {
  const { handleSaveUserinfo } = props.screenProps;
  // const dispatch = useDispatch();

  return (
    <LoginInputScreen
      onLoginSuccess={res => {
        // dispatch({
        //   type: 'account/ON_LOGIN_SUCCESS',
        //   auth: res.auth,
        //   isWehagoLogin: false
        // });
        // console.log(res.auth);

        handleSaveUserinfo(
          res.auth.AUTH_A_TOKEN,
          res.auth.AUTH_R_TOKEN,
          res.auth.HASH_KEY,
          res.auth.last_access_company_no,
          false // 위하고앱으로 로그인인지 구분
        );
      }}
      onLoginFailure={res => {}}
    />
  );
};

/**
 * LoginNavigation
 */
const LoginNavigation = createStackNavigator(
  {
    /**
     * Main Navigation
     */
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    LoginInput: {
      screen: LoginInput,
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
