/**
 * SvgButton
 * 
 * SVG전용 버튼
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const SvgButton = props => {
	const {
		// data
		width,
		height,
		backgroundColor,
		color,
		borderRadius,
		// method
		onClick,
		borderWidth,
		borderColor,
		customStyle
	} = props;

	return (
		<TouchableOpacity
			style={{
				width,
				height,
				backgroundColor,
				borderRadius,
				textAlign: 'center',
				justifyContent: 'center',
				alignItems: 'center',
				borderWidth,
				borderColor,
				...customStyle
			}}
			onPress={onClick}
		>
			<Text style={{ color }}>{props.children}</Text>
		</TouchableOpacity>
	);
};

SvgButton.defaultProps = {
	// width: 270,
	width: '100%',
	height: 47,
	backgroundColor: '#1C90FB',
	color: '#fff',
	borderRadius: 12.5,
	borderWidth: 0,
	borderColor: '#1C90FB',
	customStyle: {},
	onClick: () => {
		alert('on click');
	}
};

export default SvgButton;
