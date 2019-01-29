import React from 'react';
import { View, Text, StyleSheet, Button, SectionList, TouchableOpacity } from 'react-native';

/**
 * ConfigurationScreenPresenter
 */
const ConfigurationScreenPresenter = props => {
	const userConfig = [
		{
			title: '로그아웃',
			view: (
				<TouchableOpacity onPress={props.onLogout}>
					<Text style={styles.item}>로그아웃</Text>
				</TouchableOpacity>
			)
		}
	];

	return (
		<View style={styles.container}>
			<View
				style={{
					flex: 1,
					width: '100%'
				}}
			>
				<SectionList
					sections={[{ title: '개인정보', data: userConfig }]}
					renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
					renderItem={({ item }) => item.view}
					keyExtractor={(item, index) => index}
				/>
			</View>
		</View>
	);
};

/**
 * styles
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	},

	listContainer: {
		width: '100%',
		padding: '3%'
	},

	sectionHeader: {
		paddingTop: 7,
		paddingLeft: '4%',
		paddingRight: '4%',
		paddingBottom: 7,
		marginBottom: 10,
		fontSize: 14,
		fontWeight: 'bold',
		color: '#3f3f3f',
		backgroundColor: 'rgba(247,247,247,1.0)'
	},
	item: {
		padding: 10,
		fontSize: 15,
		height: 44
	}
});

export default ConfigurationScreenPresenter;
