/**
 * MainPresenter
 * 최상위화면
 */

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import RootNavigation from '../Navigations/RootNavigation';

const MainPresenter = props => {
	Orientation.unlockAllOrientations();
	return (
		<View style={styles.container}>
			<StatusBar hidden={false} />
			<RootNavigation />
		</View>
	);
};

/**
 * styles
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent'
	}
});

export default MainPresenter;
