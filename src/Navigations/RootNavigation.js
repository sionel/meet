import { createAppContainer, createStackNavigator } from 'react-navigation';
import MainNavigation from './MainNavigation';
import ConferenceScreen from '../Screens/ConferenceScreen';
import LoginScreen from '../Screens/LoginScreen';
import LoadingScreen from '../Screens/LoadingScreen';

/**
 * RootNavigation
 */
const RootNavigation = createStackNavigator(
	{
		/**
     * Main Navigation
     */
		Main: {
			screen: MainNavigation,
			navigationOptions: {
				header: null,
				headerLeft: null,
				gesturesEnabled: false
			}
		},

		/**
     * Conference Navigation
     */
		Conference: {
			screen: ConferenceScreen,
			navigationOptions: {
				header: null,
				headerLeft: null,
				gesturesEnabled: false
			}
		},

		/**
     * Login Navigation
     */
		Login: {
			screen: LoginScreen,
			navigationOptions: {
				header: null,
				headerLeft: null,
				gesturesEnabled: false
			}
		},

		/**
		 * Loding Navigation
		 */
		Loading: {
			screen: LoadingScreen,
			navigationOptions: {
				header: null,
				headerLeft: null,
				gesturesEnabled: false
			}
		}
	},
	// initial
	{
		initialRouteName: 'Loading',
		mode: 'modal',
		headerMode: 'none'
	}
);

export default createAppContainer(RootNavigation);
