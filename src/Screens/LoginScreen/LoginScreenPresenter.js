/**
 * LoginScreenPresenter
 * 
 * 로그인페이지 프레젠터
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FlatButton, TextField } from '../../components';

const rootPath = `../../../assets`;
const logo = require(`${rootPath}/wehago_b.svg`);

/**
 * LoginScreenPresenter
 */
const LoginScreenPresenter = props => {
	const { userId, userPwd } = props;

	/**
   * RETURN
   */
	return (
		<View style={styles.container}>
			{/* TITLE */}
			<View
				style={{
					flex: 0.1,
					justifyContent: 'flex-start',
					marginBottm: 50
				}}
			>
				<Text style={{ fontSize: 33, color: '#333' }}>WEHAGO</Text>
			</View>

			{/* INPUTS */}
			<View
				style={{
					flex: 0.2
				}}
			>
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
					onChange={text => props.onChangeValue('userPwd', text)}
					value={userPwd}
				/>
			</View>

			{/* BUTTONS */}
			<View
				style={{
					flex: 0.7,
					justifyContent: 'flex-start'
				}}
			>
				<FlatButton width={270} height={47} borderRadius={20} onClick={props.onLogin}>
					로그인
				</FlatButton>

				{/* SUB BUTTONS */}
				<View style={{ paddingTop: 20 }}>
					<Text style={{ flex: 1, textAlign: 'center' }}>최초 로그인 이후 자동 로그인됩니다</Text>
				</View>
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
		backgroundColor: '#fff',
		// justifyContent: "center",
		alignItems: 'center',
		width: '100%',
		paddingTop: 100
	},

	listContainer: {
		width: '100%',
		padding: '3%'
	}
});

export default LoginScreenPresenter;
