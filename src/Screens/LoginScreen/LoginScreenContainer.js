/**
 * LoginScreenContainer
 * 
 * 로그인페이지 컨테이너
 */

import React from 'react';
import { connect } from 'react-redux';
import { Linking } from 'react-native';
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
	 * 
	 */
	componentDidMount() {
		Linking.getInitialURL().then(url => {
			if (url) {
				this._handleGetWehagoToken({ url });
			}
		});
		// Linking.addEventListener('url', this._handleOpenURL);
		Linking.addEventListener('url', this._handleGetWehagoToken);
		this._handleCheckUser();
	}

	/**
	 * 
	 */
	/**
   * componentWillUnmount
   */
	componentWillUnmount() {
		Linking.removeEventListener('url', this._handleGetWehagoToken);
	}

	/**
	 * Rendering
	 */
	render() {
		const { navigation, permission } = this.props;
		const { list, userId, userPwd, modal, nextInput, waiting, autoLoginFlag, webView } = this.state;
		if (waiting) {
			return <CustomLottie source={'waiting'} width={225} height={225} />;
		}

		return (
			<LoginScreenPresenter
				onRedirect={this._handleRedirect}
				onChangeValue={this._handleChangeValue}
				onLogin={this._handleLogin}
				onLoginForWehago={this._handleLoginForWehago}
				onActivateModal={this._handleActivateModal}
				onEnterKeyDown={this._handleEnterKeyDown}
				onTokenLogin={this.props.onTokenLogin}
				onAgreement={this.props.onAgreement}
				navigation={navigation}
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
	 * 유저정보 체크 _handleCheckUser
	 */
	_handleCheckUser = async () => {
		const { user } = this.props;
		if (user.AUTH_A_TOKEN) {
			const result = await UserApi.check(user.AUTH_A_TOKEN, user.last_access_company_no, user.HASH_KEY);
			if (result.resultCode == 200) {
				this._handleRedirect('Home');
			}
		}
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
		Linking.openURL('wehago://?wehagomeet=login').catch(err => {
			alert('일시적인 오류가 발생했습니다. 다시 시도해 주세요');
			console.error('An error occurred', err);
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
