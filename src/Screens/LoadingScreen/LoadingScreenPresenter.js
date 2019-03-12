/**
 * LoadingScreenPresenter
 * 
 * 로그인페이지 프레젠터
 */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList } from 'react-native';

const rootPath = `../../../assets`;
const logo_login = require(`${rootPath}/logo_login.png`);

/**
 * LoadingScreenPresenter
 */
const LoadingScreenPresenter = props => {
	/**
   * RETURN
   */
	return (
		<View style={styles.container}>
			<Text>Loading</Text>
		</View>
	);
};

/**
 * styles
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		width: '100%',
		paddingTop: 100
	}
});

export default LoadingScreenPresenter;
