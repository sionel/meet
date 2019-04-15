/**
 * 
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SectionListHeader = props => {
	return (
		<View key={props.title} style={{ ...styles.sectionHeader, ...props.customStyle }}>
			<Text style={styles.textStyle}>{props.title}</Text>
		</View>
	);
};

SectionListHeader.defaultProps = {
	title: '목록',
	customStyle: {}
};

const styles = StyleSheet.create({
	sectionHeader: {
		paddingTop: 7,
		paddingLeft: 12,
		paddingRight: 12,
		paddingBottom: 7,
		marginBottom: 10,
		backgroundColor: 'rgb(255,255,255)',
		borderColor: 'rgba(0,0,0, 0.10)',
		borderBottomWidth: 1
	},
	textStyle: {
		fontSize: 14,
		lineHeight: 16,
		// height: 14,
		fontWeight: 'bold',
		color: 'rgb(140, 140, 140)'
	}
});

export default SectionListHeader;