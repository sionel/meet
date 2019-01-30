import { createAppContainer, createStackNavigator } from 'react-navigation';
import MainNavigation from './MainNavigation';
import ConferenceScreen from '../Screens/ConferenceScreen';
import LoginScreen from '../Screens/LoginScreen';

/**
 * RootNavigation
 */
const RootNavigation = createStackNavigator(
	{
		/**
     * Main Navigation
     */
		Main: {
			screen: MainNavigation
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
		}
	},
	// initial
	{
		initialRouteName: 'Main',
		mode: 'modal',
		headerMode: 'none'
	}
);

export default createAppContainer(RootNavigation);
