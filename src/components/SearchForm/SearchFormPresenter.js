/**
 * SearchFormPresenter
 * 검색바 프레젠터
 */

import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchFormPresenter = props => {
	const { active, value } = props;
	return (
		<View style={styles.wrap}>
			<Icon name="search" size={18} color="#c8c8c8" style={styles.searchIcon} />
			<TextInput
				placeholder="검색"
				ㄴ
				style={styles.input}
				onChangeText={newText => props.onChange(newText)}
				value={value}
			/>
			{active && (
				<TouchableOpacity onPress={() => props.onChange('')} style={styles.closeIcon}>
					<Icon name="times-circle" size={25} color="#c8c8c8" />
				</TouchableOpacity>
			)}
		</View>
	);
};

/**
 * Styles
 */
const styles = StyleSheet.create({
	wrap: {
		position: 'relative',
		width: '100%',
		// backgroundColor: '#f9f9f9',
		backgroundColor: '#e7e7e7',
		padding: 8,
		borderBottomWidth: 1,
		borderColor: '#dfdfdf',
		zIndex: 5
	},

	searchIcon: {
		position: 'absolute',
		left: 25,
		top: 17,
		zIndex: 10
	},

	closeIcon: {
		position: 'absolute',
		right: 23,
		top: 15,
		zIndex: 10
	},

	input: {
		height: 40,
		borderColor: '#dadada',
		borderWidth: 1,
		backgroundColor: '#fff',
		paddingLeft: 41,
		paddingRight: 10,
		borderRadius: 5,
		// borderRadius: 25.5,
		zIndex: 9
	}
});

export default SearchFormPresenter;
