import React from 'react';
import { View, Text, StyleSheet, Button, SectionList, TouchableOpacity } from 'react-native';

/**
 * ConfigurationScreenPresenter
 */
const ConfigurationScreenPresenter = props => {
	const userConfig = [
		// {
		//   title: "onDestroyToken",
		//   action: () => props.onDestroyToken()
		// },
		{
			title: '로그아웃',
			action: () => props.onLogout()
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
					renderSectionHeader={({ section }) => (
						<Text key={section.title} style={styles.sectionHeader}>
							{section.title}
						</Text>
					)}
					renderItem={({ item }, index) => (
						<TouchableOpacity key={index} onPress={item.action}>
							<Text style={styles.item}>{item.title}</Text>
						</TouchableOpacity>
					)}
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
