/**
 * AddButtonPresenter
 * 추가버튼 프레젠터
 */

import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddButtonPresenter = props => {
	return (
		<TouchableHighlight style={{ ...styles.wrap }} onPress={props.onClick} underlayColor="#0C80EB">
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
		bottom: 27,
		right: 20,
		width: 67,
		height: 67,
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
	onClick: () => {
		alert('Call');
	}
};

export default AddButtonPresenter;
