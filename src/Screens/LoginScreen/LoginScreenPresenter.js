/**
 * LoginScreenPresenter
 * 
 * 로그인페이지 프레젠터
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity, Modal, CheckBox } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FlatButton, TextField } from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';
// import CheckBox from 'react-native-check-box';

const rootPath = `../../../assets`;
const logo = require(`${rootPath}/wehago_b.svg`);

/**
 * LoginScreenPresenter
 */
const LoginScreenPresenter = props => {
	const { userId, userPwd, autoLoginFlag } = props;

	/**
   * RETURN
   */
	return (
		<View style={styles.container}>
			{/* TITLE */}
			<View style={styles.topArea}>
				<Text style={styles.logo}>WEHAGO</Text>
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
				<FlatButton width={270} height={47} borderRadius={15} onClick={props.onLogin}>
					로그인
				</FlatButton>
			</View>
			{/* BUTTONS */}
			<View style={styles.bottomArea2}>
				<FlatButton
					width={270}
					height={47}
					borderRadius={15}
					color={'#1C90FB'}
					backgroundColor={'#fff'}
					borderWidth={1}
					onClick={props.onLoginForWehago}
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
							<Text style={styles.modalMessage}>아이디와 패스워드를 확인해 주세요</Text>
						</View>
						<TouchableOpacity style={styles.modalCloseButton} onPress={() => props.onActivateModal(false)}>
							<Icon name="times" size={20} color="#fff" />
						</TouchableOpacity>
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

	modalWrap: { marginTop: 30, backgroundColor: '#F15F5F' },
	modalContents: {
		flex: 5,
		justifyContent: 'center',
		paddingTop: 17,
		paddingBottom: 17,
		paddingLeft: 10
	},
	modalMessage: { color: '#fff', fontSize: 15 },
	modalCloseButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FF8383'
	}
});

export default LoginScreenPresenter;
