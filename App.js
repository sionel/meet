import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

import JitsiMeetJS, { JitsiConnectionEvents } from './jitsi/features/base/lib-jitsi-meet';
// import "./react/features/base/lib-jitsi-meet/native/polyfills-bundler";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import Main from './src/Main';

console.log(JitsiMeetJS);
const { persistor, store } = configureStore();

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<Main />
				</PersistGate>
			</Provider>
		);
	}
}

AppRegistry.registerComponent('App', () => App);
