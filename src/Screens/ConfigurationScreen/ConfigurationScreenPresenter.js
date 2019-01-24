import React from 'react';
import { View, FlatList, ListItem, Text, StyleSheet, Button, SectionList } from 'react-native';

// components
import { ListItemComp } from '../../components';

/**
 * ConfigurationScreenPresenter
 */
const ConfigurationScreenPresenter = props => (
	<View style={styles.container}>
		<View
			style={{
				flex: 1,
				width: '100%'
			}}
		>
			<SectionList
				sections={[
					{ title: '화상대화', data: ['알림', '서버', '화질'] },
					{ title: '개인정보', data: ['이름', '자동로그인', '로그아웃'] }
				]}
				renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
				renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
				keyExtractor={(item, index) => index}
			/>
		</View>

		<View>
			<Button title="나가기" onPress={() => props.onRedirect('Home')} />
		</View>
	</View>
);

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
