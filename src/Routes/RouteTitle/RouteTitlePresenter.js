/**
 * 
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';

const RouteTitlePresenter = props => {
	let placeholder = {
		label: 'Select a Company',
		value: null,
		color: '#f1f1f1'
	};

	if (!props.auth) {
		// 기본값
		placeholder = {};
		return <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>-</Text>;
	}

	return (
		<View>
			<RNPickerSelect
				placeholder={placeholder}
				items={props.employeeList}
				onValueChange={value => {
					props.onChangeValue(value);
				}}
				style={{ ...pickerSelectStyles }}
				value={props.selectedCompany}
				useNativeAndroidPickerStyle={true}
				textInputProps={{ underlineColorAndroid: 'cyan' }}
				Icon={() => {
					return (
						<Icon
							name="caret-down"
							// name="link"
							size={22}
							color="#fff"
							style={{
								marginTop: 12
							}}
						/>
					);
				}}
			/>
		</View>
	);
};

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 18,
		paddingVertical: 12,
		paddingHorizontal: 10,
		color: '#fff',
		paddingRight: 25 // to ensure the text is never behind the icon
	},
	inputAndroid: {
		// fontSize: 18,
		paddingHorizontal: 10,
		paddingVertical: 8,
		color: '#fff',
		paddingRight: 25 // to ensure the text is never behind the icon
	}
});

export default RouteTitlePresenter;
