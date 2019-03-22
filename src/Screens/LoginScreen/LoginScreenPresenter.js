/**
 * LoginScreenPresenter
 * 
 * 로그인페이지 프레젠터
 */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList } from 'react-native';
import { FlatButton, TextField, ListItemComp, CustomWebView } from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';

const rootPath = `../../../assets`;
const logo_login = require(`${rootPath}/logo_login.png`);

/**
 * LoginScreenPresenter
 */
const LoginScreenPresenter = props => {
	const { userId, userPwd, autoLoginFlag, webView } = props;

	if (webView) {
		return (
			<CustomWebView
				view={webView}
				contentTitle="약관 및 정책"
				buttonTitle="확인"
				url="https://www.wehago.com/#/common/policy"
				onClickButton={() => props.onChangeValue('webView', false)}
			/>
		);
	}

	/**
   * RETURN
   */
	return (
		<View style={styles.container}>
			{/* TITLE */}
			<View style={styles.topArea}>
				{/* <Text style={styles.logo}>WEHAGO</Text> */}
				<Image
					style={{
						width: 207,
						height: 63
					}}
					source={logo_login}
				/>
			</View>

			{/* INPUTS */}
			<View style={styles.middleArea}>
				<TextField
					placeholder={'아이디를 입력하세요'}
					width={270}
					height={40}
					onChange={text => props.onChangeValue('userId', text)}
					value={userId}
				/>
				<TextField
					placeholder={'패스워드를 입력하세요'}
					width={270}
					height={40}
					secret={true}
					onChange={text => props.onChangeValue('userPwd', text)}
					onSubmit={props.onEnterKeyDown}
					value={userPwd}
				/>
			</View>

			{/* BUTTONS */}
			<View style={styles.bottomArea}>
				<FlatButton width={275} height={52} borderRadius={30} onClick={props.onLogin}>
					로그인
				</FlatButton>
			</View>
			{/* BUTTONS */}
			<View style={styles.bottomArea2}>
				<FlatButton
					width={275}
					height={52}
					borderRadius={30}
					color={'#1C90FB'}
					backgroundColor={'#fff'}
					borderColor={'#1C90FB'}
					borderWidth={1}
					onClick={props.onLoginForWehago}
					// onClick={props.onAgreement}
				>
					WEHAGO 로그인
				</FlatButton>
			</View>

			{/* 모달 */}
			<Modal
				animationType="slide"
				transparent={false}
				visible={props.modal}
				transparent={true}
				animationType="fade"
			>
				<View style={styles.modalWrap}>
					<View style={{ flexDirection: 'row' }}>
						<View style={styles.modalContents}>
							<Text style={styles.modalMessage}>{props.modalText}</Text>
						</View>
						<TouchableOpacity style={styles.modalCloseButton} onPress={() => props.onActivateModal("", false)}>
							<Icon name="times" size={20} color="#fff" />
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* 권한 컨펌모달 */}
			<Modal animationType="fade" transparent={true} visible={!props.permissionModal} blurRadius={1}>
				<View style={styles.permission_modalWrap}>
					<View style={styles.permission_modalContentWrap}>
						<View style={styles.permission_modalMessage}>
							<Text
								style={{
									fontSize: 18,
									color: '#1C90FB',
									marginBottom: 10
								}}
							>
								WEHAGO Meet 권한 안내
							</Text>
							<View
								style={{
									borderTopWidth: 1,
									borderColor: '#bbdefe',
									paddingTop: 18
								}}
							>
								<Text style={{ fontSize: 16, fontWeight: '500' }}>필수 접근권한</Text>
								<View
									style={{
										backgroundColor: '#f1f1f1',
										marginTop: 8,
										marginBottom: 12,
										paddingTop: 15,
										paddingLeft: 10,
										paddingRight: 10
									}}
								>
									<FlatList
										data={[
											{ key: "1", title: '카메라', description: '화상대화 카메라', icon: 'camera' },
											{ key: "2", title: '마이크', description: '화상대화 내 음성 전송', icon: 'microphone' },
											{ key: "3", title: '스피커', description: '화상대화 음성 출력', icon: 'volume-up' },
											{ key: "4", title: '알림', description: '화상대화 실시간 알림', icon: 'bell' }
										]}
										renderItem={({ item }) => (
											<ListItemComp
												key={item.key}
												title={item.title}
												updated={item.description}
												descriptionType={'text'}
												iconSize={70}
											>
												<Icon name={item.icon} size={20} color="#333" />
											</ListItemComp>
										)}
									/>
								</View>
								<Text style={{ fontSize: 16, fontWeight: '500' }}>이용약관 및 법률고지</Text>
								<View
									style={{
										// backgroundColor: '#f1f1f1',
										marginTop: 8,
										marginBottom: 12
										// padding: 10
									}}
								>
									<FlatButton
										height={40}
										borderRadius={0}
										color={'#333'}
										borderWidth={1}
										borderColor={'#c8c8c8'}
										backgroundColor={'none'}
										onClick={() => props.onChangeValue('webView', true)}
									>
										이용약관 보기
									</FlatButton>
									<FlatButton
										height={40}
										borderRadius={0}
										color={'#333'}
										borderWidth={1}
										borderColor={'#c8c8c8'}
										backgroundColor={'none'}
										customStyle={{ borderTopWidth: 0 }}
										onClick={() => props.onChangeValue('webView', true)}
									>
										법률고지 보기
									</FlatButton>
								</View>
								{/* <Text style={{ fontSize: 16, fontWeight: '500' }}>선택 접근권한</Text> */}
							</View>
						</View>
						<View style={styles.permission_modalButtons}>
							<TouchableOpacity
								style={{ ...styles.permission_modalButton, ...styles.permission_modalButtonConfirm }}
								// onPress={() => props.onChangeValue('permissionModal', false)}
								onPress={props.onAgreement}
							>
								<Text style={{ color: '#fff' }}>동의</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 웹뷰모달 */}

			{/* <CustomWebView
				view={webView}
				contentTitle="약관 및 정책"
				buttonTitle="확인"
				url="https://www.wehago.com/#/common/policy"
			/> */}
		</View>
	);
};

/**
 * styles
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		width: '100%',
		paddingTop: 100
	},

	topArea: {
		flex: 0.75,
		justifyContent: 'flex-start'
	},
	logo: { fontSize: 33, color: '#333' },

	middleArea: {
		flex: 3,
		justifyContent: 'center'
	},

	bottomArea: {
		flex: 4,
		justifyContent: 'flex-start'
	},
	bottomArea2: {
		flex: 2,
		justifyContent: 'center'
	},

	listContainer: {
		width: '100%',
		padding: '3%'
	},

	modalWrap: { paddingTop: 32, backgroundColor: '#F15F5F' },
	modalContents: {
		flex: 5,
		justifyContent: 'center',
		paddingTop: 17,
		paddingBottom: 17,
		paddingLeft: 17
	},
	modalMessage: { color: '#fff', fontSize: 15 },
	modalCloseButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#FF8383'
	},

	permission_modalWrap: {
		// marginTop: 22,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0, .75)'
	},

	permission_modalContentWrap: {
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

	permission_modalMessage: {
		paddingTop: 15,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20
		// borderWidth: 1,
		// borderColor: '#1C90FB'
	},

	permission_modalButtons: { flexDirection: 'row' },
	permission_modalButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15,
		marginBottom: -1
	},
	permission_modalButtonCancel: { backgroundColor: '#f1f1f1' },
	permission_modalButtonConfirm: { backgroundColor: '#1C90FB' }
});

export default LoginScreenPresenter;
