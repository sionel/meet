/**
 * Route INDEX
 * 
 */

// RN
import React from 'react'
// Navigation
import { 
    TabNavigator, 
    StackNavigator, 
    createStackNavigator, 
    createTabNavigator,
    createAppContainer,
    createSwitchNavigator
} from 'react-navigation';

/*
화면을 index로 export해서 불러오면 인식하지 못함 -> 개별적으로 불러오면 해결
*/
// Home Screen 
import HomeScreen from '../Routes/HomeRoute';
// import HomeScreen from '../Pages/Home';
// import HomeScreen from '../Screens/HomeScreen/HomeScreenContainer';
// Conference Screen 
import ConferenceScreen from '../Pages/Conference';

/**
 * Routes
 */
const Routes = createSwitchNavigator(
// const Routes = createTabNavigator(
    // 화면목록
    { 
        // Home - 메인화면
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                header: null,
              }
        },
        // Conference - 화상대화 접속화면
        Conference: {
            screen: ConferenceScreen,
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