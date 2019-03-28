/**
 * 
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
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

	// 임시 사용
	return (
		<Text style={[{ color: '#fff', fontWeight: 'bold', fontSize: 17 }, Platform.OS !== "ios" && { marginLeft: 20 }]}>
			{props.auth.employee_list.filter(e => e.company_no == props.auth.last_access_company_no)[0].company_name_kr}
		</Text>
	);

	// 접속회사 변경 시 사용
	return (
		<View>
			<RNPickerSelect
				placeholder={placeholder}
				items={props.auth.employee_list.map(e => ({
					label: e.company_name_kr,
					value: e.company_no
				}))}
				onValueChange={value => {
					props.onChangeValue(value);
				}}
				style={{ ...pickerSelectStyles }}
				value={props.auth.last_access_company_no}
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
