/**
 * Input
 * 커스텀 입력창
 */

import React from 'react';
import { View, Text, TextInput, Platform } from 'react-native';

let inputs = {};

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
		onSubmit,
		refs
	} = props;

	inputs[refs] = React.createRef();

	return (
		<TextInput
			style={{
				width,
				height,
				marginTop,
				color,
				borderBottomWidth,
				borderBottomColor,
				fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif'
			}}
			placeholder={placeholder}
			placeholderTextColor={placeholderTextColor}
			value={value}
			onChangeText={onChange}
			secureTextEntry={secret}
			autoCapitalize={!autoCapitalize ? 'none' : 'words'}
			onSubmitEditing={typeof onSubmit === 'string' ? () => inputs[onSubmit].focus() : onSubmit}
			returnKeyType={typeof onSubmit === 'string' ? 'next' : 'go'}
			// autoFocus={refs === 'inputId'}
			ref={ref => inputs[refs] = ref}
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
	onChange: () => alert('onChange'),
	refs: null
};

export default TextField;
