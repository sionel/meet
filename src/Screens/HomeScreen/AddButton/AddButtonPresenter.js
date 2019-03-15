/**
 * AddButtonPresenter
 * 추가버튼 프레젠터
 */

import React from 'react';
import { StyleSheet, View, TouchableHighlight, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddButtonPresenter = props => {
	const size = Platform.isPad ? 85 : props.size;
	return (
		<TouchableHighlight
			style={{ ...styles.wrap, width: size, height: size }}
			onPress={props.onClick}
			underlayColor="#0C80EB"
		>
			<View style={{ ...styles.text }}>
				<Icon name="phone" size={25} color="#fff" />
			</View>
		</TouchableHighlight>
	);
};

/**
 * Styles
 */
const styles = StyleSheet.create({
	wrap: {
		position: 'absolute',
		bottom: 30,
		right: 20,
		width: 71,
		height: 71,
		borderRadius: 100,
		backgroundColor: '#1C90FB',
		zIndex: 50,
		flexDirection: 'row',
		shadowOffset: { width: 1, height: 2 },
		shadowColor: 'black',
		shadowOpacity: 0.35
	},

	text: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

AddButtonPresenter.defaultProps = {
	size: 70,
	onClick: () => {
		alert('Call');
	}
};

export default AddButtonPresenter;
