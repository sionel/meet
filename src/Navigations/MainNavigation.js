/**
 * Route INDEX
 */

import React from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";

// 화면을 index로 export해서 불러오면 인식하지 못함 -> 개별적으로 불러오면 해결
// Home Route
import HomeRoute from "../Routes/HomeRoute";
// Create Route
import CreateRoute from "../Routes/CreateRoute";
// Login Route
import LoginRoute from "../Routes/LoginRoute";

/**
 * Routes
 * createStackNavigator사용시 라이브러리를 못찾는 에러 존재(react-native link ~ 사용불가)
 */
const Routes = createStackNavigator(
  {
    /**
     * Home - 메인화면
     */
    Home: {
      screen: HomeRoute,
      navigationOptions: {
        header: null
      }
    },
    /**
     * Create - 대화생성화면
     */
    Create: {
      screen: CreateRoute,
      navigationOptions: {
        header: null
      }
    },
    /**
     * Login - 로그인화면
     */
    Login: {
      screen: LoginRoute,
      navigationOptions: {
        header: null
      }
    }
  },

  // initial
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(Routes);
