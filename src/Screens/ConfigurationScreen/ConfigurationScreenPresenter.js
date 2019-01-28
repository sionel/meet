import React from 'react';
import { View, Text, StyleSheet, Button, SectionList, TouchableOpacity } from 'react-native';

// components
import { ListItemComp } from '../../components';

/**
 * ConfigurationScreenPresenter
 */
const ConfigurationScreenPresenter = props => {
	const conferenceConfig = [
		{
			title: '알림',
			view: <Text style={styles.item}>알림</Text>
		},
		{
			title: '서버',
			view: <Text style={styles.item}>서버</Text>
		},
		{
			title: '전송화질',
			view: <Text style={styles.item}>전송화질</Text>
		}
	];
	const userConfig = [
		{
			title: '이름',
			view: <Text style={styles.item}>이름</Text>
		},
		{
			title: '자동로그인',
			view: <Text style={styles.item}>자동로그인</Text>
		},
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
					sections={[{ title: '화상대화', data: conferenceConfig }, { title: '개인정보', data: userConfig }]}
					renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
					renderItem={({ item }) => item.view}
					keyExtractor={(item, index) => index}
				/>
			</View>

			<View>
				<Button title="나가기" onPress={() => props.onRedirect('Home')} />
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
