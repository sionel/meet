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

	if (this.props.auth) {
		// 기본값
		placeholder = {};
		// 회사목록
		// employeeList = this.props.auth.employee_list.map(e => ({
		// 	label: e.company_name_kr,
		// 	value: e.company_no
		// }));
		// // 선택된 회사
		// selectedCompany = this.props.auth.last_access_company_no;
	}

	return (
		<View>
			<RNPickerSelect
				placeholder={placeholder}
				items={this.state.employeeList}
				onValueChange={value => {
					// this.props.onChangeCompany(value);
					this.setState({ selectedCompany: value });
				}}
				style={{ ...pickerSelectStyles }}
				value={this.state.selectedCompany}
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
		fontSize: 18,
		paddingHorizontal: 10,
		paddingVertical: 8,
		color: '#fff',
		paddingRight: 25 // to ensure the text is never behind the icon
	}
});

export default RouteTitlePresenter;
