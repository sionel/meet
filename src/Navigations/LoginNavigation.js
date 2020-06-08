import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import LoginCheckScreen from '../Screens/LoginScreen';
// import LoginInputScreen from '../Screens/LoginScreen/LoginInputScreen';
import { LoginScreen, LoginInputScreen } from 'rn-component';
import { WEHAGO_TYPE, WEHAGO_ENV } from '../../config';

const Login = props => {
  return (
    <LoginCheckScreen {...props}>
      <LoginScreen
        wehagoType={WEHAGO_ENV}
        serviceCode={'wehagomeet'}
        text1={'시간과 장소의 제약 없는\n효율적인 화상회의'}
        text2={WEHAGO_TYPE + ' Meet'}
        onManualLogin={() => {
          props.navigation.navigate({
            routeName: 'LoginInput',
            params: {
              ...props.screenProps
            }
          });
        }}
      />
    </LoginCheckScreen>
  );
};

const LoginInput = props => {
  const { handleSaveUserinfo } = props.navigation.state.params;

  return (
    <LoginInputScreen
      // devServer={true}
      // navigation={props.navigation}
      wehagoType={WEHAGO_ENV}
      serviceCode={'wehagomeet'}
      onLoginSuccess={res => {
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
      // screen: LoginScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    LoginInput: {
      screen: LoginInput,
      // screen: LoginInputScreen,
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
