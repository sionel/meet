/**
 * Input
 * 커스텀 입력창
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';

const TextField = props => {
	const {
		// data
		width,
		height,
		marginTop,
		color,
		borderBottomWidth,
		borderBottomColor,
		value,
		placeholder,
		placeholderTextColor,
		// methods
		onChange,
		secret,
		autoCapitalize,
		onSubmit
	} = props;
	return (
		<TextInput
			style={{
				width,
				height,
				marginTop,
				color,
				borderBottomWidth,
				borderBottomColor
			}}
			placeholder={placeholder}
			placeholderTextColor={placeholderTextColor}
			value={value}
			onChangeText={onChange}
			secureTextEntry={secret}
			autoCapitalize={!autoCapitalize ? 'none' : 'words'}
			onSubmitEditing={onSubmit}
		/>
	);
};

TextField.defaultProps = {
	width: '100%',
	height: 40,
	marginTop: 15,
	color: '#8C8C8C',
	borderBottomWidth: 1,
	borderBottomColor: '#CACACA',
	value: '',
	placeholder: '내용을 입력하세요',
	placeholderTextColor: '#CACACA',
	secret: false,
	autoCapitalize: false,
	onSubmit: () => 0,
	onChange: () => alert('onChange')
};

export default TextField;
