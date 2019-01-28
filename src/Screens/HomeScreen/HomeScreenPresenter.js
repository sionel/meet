/**
 * HomeScreenPresenter
 * 화상대화 히스토리 프레젠터
 */
import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Modal, TouchableOpacity, SectionList } from 'react-native';
// common components
import { ListItemComp, SearchForm } from '../../components';
// 추가버튼
import AddButton from './AddButton';

/**
 * HomeScreenPresenter
 */
const HomeScreenPresenter = props => {
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
				refreshing={props.refreshing}
				onRefresh={props.onRefresh}
				style={styles.listContainer}
				sections={[
					{
						title: '대화중',
						data: props.list.filter(item => item.conference === true)
					},
					{
						title: '그룹대화',
						data: props.list.filter(item => item.conference === false && item.room_type === '1')
					},
					{
						title: '1:1대화',
						data: props.list.filter(item => item.conference === false && item.room_type === '2')
					}
				]}
				renderSectionHeader={({ section }) =>
					section.data.length > 0 && <Text style={styles.sectionHeader}>{section.title}</Text>}
				renderItem={({ item }) => (
					// 히스토리 아이템
					<ListItemComp
						title={item.room_title}
						personnel={item.receiver_user_count}
						updated={item.update_timestamp}
						active={item.conference}
						// onClick={() => props.onRedirect('Conference')}
						onClick={
							item.conference === true
								? () => props.onRedirect('Conference')
								: () => props.onActivateModal(item.room_id)
						}
					/>
				)}
			/>

			{/* 테스트용 버튼 */}
			<View>
				<Button title={'Go login' + props.selectedRoomId} onPress={() => props.onRedirect('Login')} />
			</View>

			{/* 컨펌모달 */}
			<Modal animationType="fade" transparent={true} visible={props.modal}>
				<View style={styles.modalWrap}>
					<View style={styles.modalContentWrap}>
						<Text style={styles.modalMessage}>새로운 화상대화를 시작하시겠습니까?</Text>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={{ ...styles.modalButton, ...styles.modalButtonCancel }}
								onPress={() => props.onActivateModal()}
							>
								<Text style={{ color: '#333' }}>취소</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{ ...styles.modalButton, ...styles.modalButtonConfirm }}
								onPress={() => props.onCreateConference(props.selectedRoomId)}
								// onPress={() => props.onRedirect('Conference')}
							>
								<Text style={{ color: '#fff' }}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 방생성 버튼 */}
			{/* <AddButton onClick={() => props.onRedirect('Create')} /> */}
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
		marginTop: 22,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
		// backgroundColor: 'rgba(0,0,0,.2)'
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
		paddingTop: 37,
		paddingBottom: 37,
		paddingLeft: 20,
		paddingRight: 20
	},

	modalButtons: { flexDirection: 'row' },
	modalButton: {
		flex: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15
	},
	modalButtonCancel: { backgroundColor: '#f1f1f1' },
	modalButtonConfirm: { backgroundColor: '#1C90FB' }
});

export default HomeScreenPresenter;
