// /**
//  * CreateRoute
//  *
//  */

// import { createStackNavigator, createAppContainer } from 'react-navigation';
// // import LoginScreen from '@screens/LoginScreen';
// import LoginScreenPresenter from '@screens/LoginScreen';
// import LoginInputScreen from '@screens/LoginScreen/LoginInputScreen';

// // 메인화면
// export const LoginMain = createStackNavigator(
//   {
//     LoginMain: LoginScreenPresenter, // 메인 화면
//     // LoginInput: LoginInputScreen // ID, PW 입력 화면
//   },
//   Object.assign(
//     {},
//     {
//       initialRouteName: 'LoginMain',
//       transparentCard: true,
//       mode: 'card',
//       headerMode: 'none'
//     }
//   )
// );

// export default createAppContainer(
//   createStackNavigator(
//     {
//       Login: LoginMain
//     },
//     {
//       initialRouteName: 'Login',
//       headerMode: 'none'
//     }
//   )
// );
