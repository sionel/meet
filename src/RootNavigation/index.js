/**
 * Route INDEX
 * 
 */

import React from 'react'
import { 
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation';

// 화면을 index로 export해서 불러오면 인식하지 못함 -> 개별적으로 불러오면 해결
// Home Screen 
import HomeScreen from '../Routes/HomeRoute';

/**
 * Routes
 * createStackNavigator사용시 라이브러리를 못찾는 에러 존재(react-native link ~ 사용불가)
 */
// const Routes = createSwitchNavigator(
const Routes = createStackNavigator(
    // 화면목록
    { 
        // Home - 메인화면
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                header: null,
              }
        },
    }, 

    // initial
    { 
        initialRouteName: 'Home',
    }
);

export default createAppContainer(Routes);