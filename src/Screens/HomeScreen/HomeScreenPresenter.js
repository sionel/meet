/**
 * HomeScreenPresenter
 * 화상대화 히스토리 프레젠터
 */

import React, { Fragment } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SectionList, Image } from 'react-native';
// common components
import { ListItemComp, SearchForm, CustomModal, Placeholder, CustomLottie, SectionListHeader } from '../../components';
import AddButton from './AddButton';
import Icon from 'react-native-vector-icons/FontAwesome';

const rootPath = `../../../assets`;
const waitingImage = require(`${rootPath}/waiting.gif`);

/**
 * HomeScreenPresenter
 */
const HomeScreenPresenter = props => {
	console.log('WE Talk : ', props);
	const activateList = props.list.filter(item => item.is_video_access === 'T');

	return (
		<View style={styles.container}>
			{/* 검색바 */}
			<SearchForm onChange={props.onSearch} />

			{(props.list.length < 1 || activateList.length < 1) && (
					<Placeholder mainText={'진행중인 화상회의가 없습니다.'} subText={'대화를 시작하려면 +버튼을 누르세요.'} />
				)}

			{/* 화상대화 히스토리 리스트 */}
			<SectionList
				keyExtractor={(item, index) => index.toString()}
				refreshing={props.refreshing}
				onRefresh={props.onRefresh}
				style={styles.listContainer}
				sections={[{ title: '진행중', data: activateList, length: activateList.length - 1 }]}
				renderSectionHeader={({ section }) =>
					section.data.length > 0 && <SectionListHeader title={section.title} />}
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
						onClick={() =>
							item.is_video_access === 'T'
								? props.onCheckConference(item.video_chat_id)
								: props.onActivateModal(item.room_id)}
					/>
				)}
			/>

			{/* 방생성 버튼 */}
			<AddButton onClick={() => props.onRedirect('Create')} />

			{/* 컨펌모달 */}
			<Modal animationType="fade" transparent={true} visible={props.modal} blurRadius={1}>
				<View style={styles.modalWrap}>
					<View style={styles.modalContentWrap}>
						<TouchableOpacity
							style={{
								position: 'absolute',
								right: 10,
								top: 10,
								zIndex: 11
							}}
							onPress={() => props.onActivateModal(null)}
						>
							<Icon
								name="times-circle"
								size={30}
								color="#CACACA"
								style={{
									zIndex: 10
								}}
							/>
						</TouchableOpacity>

						<View style={styles.modalMessage}>
							<Text
								style={{
									fontSize: 22,
									color: '#1C90FB',
									marginBottom: 20
								}}
							>
								알림
							</Text>
							<Text>새로운 화상대화를 시작하시겠습니까?</Text>
						</View>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={{ ...styles.modalButton, ...styles.modalButtonConfirm }}
								onPress={() => props.onCreateConference(props.selectedRoomId)}
							>
								<Text style={{ color: '#fff' }}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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

export default HomeScreenPresenter;
