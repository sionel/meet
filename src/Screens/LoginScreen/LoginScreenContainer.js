/**
 * LoginScreenContainer
 * 
 * 로그인페이지 컨테이너
 */

import React from 'react';
import { connect } from 'react-redux';
import { Linking, Platform } from 'react-native';
import { actionCreators as UserActions } from '../../redux/modules/user';
import LoginScreenPresenter from './LoginScreenPresenter';
import { CustomLottie } from '../../components';
// service
import { UserApi } from '../../services';
import { querystringParser } from '../../utils';

class LoginScreenContainer extends React.Component {
	/**
	 * STATE
	 */
	state = {
		userId: '',
		userPwd: '',
		nextInput: null,
		modal: false,
		waiting: false,
		autoLoginFlag: true,
		webView: false
	};

	/**
	 * Rendering
	 */
	render() {
		const { permission } = this.props;
		const { list, userId, userPwd, modal, nextInput, waiting, autoLoginFlag, webView } = this.state;
		if (waiting) {
			return <CustomLottie source={'waiting'} width={225} height={225} />;
		}

		return (
			<LoginScreenPresenter
				onChangeValue={this._handleChangeValue}
				onLogin={this._handleLogin}
				onLoginForWehago={this._handleLoginForWehago}
				onActivateModal={this._handleActivateModal}
				onEnterKeyDown={this._handleEnterKeyDown}
				onTokenLogin={this.props.onTokenLogin}
				onAgreement={this.props.onAgreement}
				autoLoginFlag={autoLoginFlag}
				userPwd={userPwd}
				userId={userId}
				list={list}
				modal={modal}
				webView={webView}
				permissionModal={permission}
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
	 * _handleLogin
	 * 로그인함수
	 */
	_handleLogin = async (wehagoLogin = false) => {
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
		// result data
		const loginResult = await UserApi.login(data);
		let userData = {}; // Login API

		if (loginResult.resultCode === 200) {
			this._handleSaveUserinfo(
				loginResult.resultData.AUTH_A_TOKEN,
				loginResult.resultData.AUTH_R_TOKEN,
				loginResult.resultData.HASH_KEY,
				loginResult.resultData.last_access_company_no
			);
		} else {
			this._handleActivateModal();
		}
	};

	/**
	 * _handleSaveUserinfo
	 */
	_handleSaveUserinfo = async (AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno) => {
		/**
		 * cno
		 * AUTH_A_TOKEN
		 * AUTH_R_TOKEN
		 * HASH_KEY
		 */

		const { onLogin, navigation } = this.props;
		const checkResult = await UserApi.check(AUTH_A_TOKEN, cno, HASH_KEY);

		if (checkResult.resultCode != 200) {
			alert('다시 시도해 주세요');
		} else {
			// 유저정보
			const userData = {
				// login api data
				AUTH_A_TOKEN,
				AUTH_R_TOKEN,
				HASH_KEY,
				// check api data
				user_no: checkResult.resultData.user_no,
				portal_id: checkResult.resultData.portal_id, // 아이디
				user_name: checkResult.resultData.user_name,
				user_email: checkResult.resultData.user_email,
				profile_url: checkResult.resultData.profile_url,
				user_contact: checkResult.resultData.user_contact,
				employee_list: checkResult.resultData.employee_list, // 회사정보
				last_access_company_no: checkResult.resultData.last_access_company_no,
				last_company: checkResult.resultData.employee_list.filter(
					e => e.company_no == checkResult.resultData.last_access_company_no
				)[0]
			};
			onLogin(userData);
	
			navigation.navigate('Home');
		}
	};

	/**
	 * _handleLoginForWehago
	 */
	_handleLoginForWehago = () => {
		const url = 'wehago://?wehagomeet=login';
		const iosMarketURL = "";
		const androidMarketURL = "";

		Linking.canOpenURL(url)
			.then(supported => {
				if (!supported) { // not supported
					if (Platform.OS === "ios") {
						Linking.openURL(iosMarketURL);
					} else if (Platform.OS === "android") {
						Linking.openURL(androidMarketURL);
					}
				} else { // supported
					Linking.openURL(url).then((data) => {
						console.log(data);
					})
				}
			})
			.catch(err => {
				alert('앱 정보가 없습니다.');
				console.log(err);
				// console.error('An error occurred', err);
			});
	};

	/**
	 * 
	 */
	_handleGetWehagoToken = event => {
		const result = querystringParser(event.url);
		Linking.removeEventListener('url', this._handleGetWehagoToken);
		this._handleSaveUserinfo(result.mAuth_a_token, result.mAuth_r_token, result.mHASH_KEY, result.cno);
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
	user: state.user.auth,
	permission: state.user.permission
});

// map dispatch to props
let mapDispatchToProps = dispatch => ({
	onLogin: user => dispatch(UserActions.login(user)),
	onAgreement: () => dispatch(UserActions.agreement())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreenContainer);
