/**
 * Route INDEX
 */

import { createAppContainer, createStackNavigator } from 'react-navigation';

// 화면을 index로 export해서 불러오면 인식하지 못함 -> 개별적으로 불러오면 해결
// Home Route
import HomeRoute from '../Routes/HomeRoute';
// Create Route
// import CreateRoute from '../Routes/CreateRoute';

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
		}
	},
	// initial
	{
		initialRouteName: 'Home',
		cardStyle: { backgroundColor: 'none', transparent: true }
	}
);

export default createAppContainer(Routes);
