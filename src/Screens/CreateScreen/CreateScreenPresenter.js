/**
 * CreateScreenPresenter
 * 화상대화 히스토리 프레젠터
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SectionList } from 'react-native';
// common components
import { ListItemComp, SearchForm } from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';

/**
 * CreateScreenPresenter
 */
const CreateScreenPresenter = props => {
	const groupList = props.list.filter(item => item.room_type === '2' && item.is_video_access === 'F');
	const personnelList = props.list.filter(item => item.room_type === '1' && item.is_video_access === 'F');
	// const activateList = props.list.filter(item => item.is_video_access === 'T');

	return (
		<View style={styles.container}>
			{/* 검색바 */}
			<SearchForm onChange={props.onSearch} />

			{props.list.length < 1 && (
				<View style={styles.notResult}>
					<Text>검색된 결과가 없습니다 :(</Text>
				</View>
			)}

			{/* 화상대화 히스토리 리스트 */}
			<SectionList
				keyExtractor={(item, index) => index.toString()}
				refreshing={props.refreshing}
				onRefresh={props.onRefresh}
				style={styles.listContainer}
				sections={[
					// { title: '대화중', data: activateList, length: activateList.length - 1 },
					{ title: `그룹대화(${groupList.length})`, data: groupList, length: groupList.length - 1 },
					{ title: `1:1대화(${personnelList.length})`, data: personnelList, length: personnelList.length - 1 }
				]}
				renderSectionHeader={({ section }) =>
					section.data.length > 0 && (
						<Text key={section.title} style={styles.sectionHeader}>
							{section.title}
						</Text>
					)}
				renderItem={({ item, index, section }) => (
					// 히스토리 아이템
					<ListItemComp
						key={item.room_id}
						title={item.room_title}
						personnel={item.receiver_user_count}
						updated={item.update_timestamp}
						lottie={true}
						underline={index < section.length ? true : false}
						active={item.is_video_access === 'T' ? true : false}
						disable={item.receiver_user_count === 1 && item.room_type === '1' ? true : false}
					/>
				)}
			/>
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
		width: '100%'
		// padding: '4% 3%'
	},

	notResult: {
		height: '10%',
		justifyContent: 'center',
		alignItems: 'center'
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

	modalWrap: {
		// marginTop: 22,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0, .75)'
	},

	modalContentWrap: {
		backgroundColor: '#fff',
		width: '100%',
		maxWidth: 300,
		padding: 0,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},

	modalMessage: {
		paddingTop: 20,
		paddingBottom: 30,
		paddingLeft: 20,
		paddingRight: 20
		// borderWidth: 1,
		// borderColor: '#1C90FB'
	},

	modalButtons: { flexDirection: 'row' },
	modalButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15,
		marginBottom: -1
	},
	modalButtonCancel: { backgroundColor: '#f1f1f1' },
	modalButtonConfirm: { backgroundColor: '#1C90FB' }
});

export default CreateScreenPresenter;
