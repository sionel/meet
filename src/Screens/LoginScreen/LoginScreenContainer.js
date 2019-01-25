/**
 * LoginScreenContainer
 * 
 * 로그인페이지 컨테이너
 */

import React from 'react';
// import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';
import LoginScreenPresenter from './LoginScreenPresenter';
// service
import { UserApi } from '../../services';

class LoginScreenContainer extends React.Component {
	/**
	 * STATE
	 */
	state = {
		userId: '',
		userPwd: ''
	};

	/**
	 * Rendering
	 */
	render() {
		const { navigation } = this.props;
		const { list, userId, userPwd } = this.state;

		return (
			<LoginScreenPresenter
				onRedirect={this._handleRedirect}
				onChangeValue={this._handleChangeValue}
				onLogin={this._handleLogin}
				navigation={navigation}
				userPwd={userPwd}
				userId={userId}
				list={list}
			/>
		);
	} // render

	/**
	 * _handleChangeValue
	 * 페이지 이동
	 */
	_handleChangeValue = (target, value) => {
		this.setState({ [target]: value });
	};

	/**
	 * _handleRedirect
	 * 페이지 이동
	 */
	_handleRedirect = url => {
		const { navigation } = this.props;
		navigation.navigate(url);
	};

	/**
	 * _handleLogin
	 * 로그인함수
	 */
	_handleLogin = async () => {
		const { navigation } = this.props;
		const { userId, userPwd } = this.state;
		const { onLogin } = this.props;
		const data = {
			// portal_id: 'seongh7800',
			// portal_password: 'kseongh0080',
			portal_id: userId,
			portal_password: userPwd,
			login_ip: '10.51.114.169',
			login_device: 'iPhone',
			login_os: 'IOS 12.1.2',
			login_browser: 'WEHAGO-APP'
		};

		const result = await UserApi.login(data);
		if (result.resultCode === 200) {
			// 아이디패스워드 저장
			result.resultData.portal_id = data.portal_id;
			result.resultData.portal_password = data.portal_password;
			onLogin(result.resultData);
			navigation.navigate('Home');
		} else {
			console.log(result.resultMsg);
		}
	};
}

// map state to props
let mapStateToProps = state => ({
	user: state.user.auth
});

// map dispatch to props
let mapDispatchToProps = dispatch => ({
	onLogin: user => dispatch(UserActions.login(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreenContainer);
