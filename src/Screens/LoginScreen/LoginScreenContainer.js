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
import { CustomLottie } from '../../components';
// service
import { UserApi } from '../../services';

class LoginScreenContainer extends React.Component {
	/**
	 * STATE
	 */
	state = {
		userId: 'seongh7800',
		userPwd: 'kseongh0080',
		nextInput: null,
		modal: false,
		waiting: false
	};

	/**
	 * Rendering
	 */
	render() {
		const { navigation } = this.props;
		const { list, userId, userPwd, modal, nextInput, waiting } = this.state;

		if (waiting) {
			return <CustomLottie source={'waiting'} width={225} height={225} />;
		}

		return (
			<LoginScreenPresenter
				onRedirect={this._handleRedirect}
				onChangeValue={this._handleChangeValue}
				onLogin={this._handleLogin}
				onActivateModal={this._handleActivateModal}
				onEnterKeyDown={this._handleEnterKeyDown}
				navigation={navigation}
				userPwd={userPwd}
				userId={userId}
				list={list}
				modal={modal}
				nextInput={nextInput}
				phrases="Loading"
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
			portal_id: userId,
			portal_password: userPwd,
			login_ip: '10.51.114.169',
			login_device: 'iPhone',
			login_os: 'IOS 12.1.2',
			login_browser: 'WEHAGO-APP'
		};

		// Login API
		let userData = {};
		const loginResult = await UserApi.login(data);

		if (loginResult.resultCode === 200) {
			// get user data API
			const checkResult = await UserApi.check(
				loginResult.resultData.AUTH_A_TOKEN,
				loginResult.resultData.last_access_company_no
			);

			// 유저정보
			userData = {
				// login api data
				portal_id: loginResult.resultData.portal_id,
				portal_password: loginResult.resultData.portal_password,
				last_access_company_no: loginResult.resultData.last_access_company_no,
				AUTH_A_TOKEN: loginResult.resultData.AUTH_A_TOKEN,
				AUTH_R_TOKEN: loginResult.resultData.AUTH_R_TOKEN,
				// check api data
				profile_url: checkResult.resultData.profile_url,
				user_contact: checkResult.resultData.user_contact,
				user_email: checkResult.resultData.user_email,
				user_name: checkResult.resultData.user_name,
				user_no: checkResult.resultData.user_no,
				employee_list: checkResult.resultData.employee_list // 회사정보
			};
			onLogin(userData);

			navigation.navigate('Home');
		} else {
			this._handleActivateModal();
		}
	};

	/**
	 * _handleActivateModal
	 * 로그인 실패 시 경고 모달 ON
	 */
	_handleActivateModal = (val = true) => {
		this.setState(prev => ({ modal: val }));
		// 자동 close
		if (val) {
			setTimeout(() => {
				this.setState(prev => ({ modal: false }));
			}, 2100);
		}
	};

	/**
	 * _handleEnterKeyDown
	 * 엔터키 입력 시
	 */
	_handleEnterKeyDown = e => {
		this._handleLogin();
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
