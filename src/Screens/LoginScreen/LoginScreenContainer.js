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
				alert(url);
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
				loginResult.resultData.last_access_company_no,
				loginResult.resultData.HASH_KEY
			);

			// 유저정보
			userData = {
				// login api data
				portal_id: data.portal_id, // 아이디
				// portal_password: data.portal_password, // 패스워드
				last_access_company_no: loginResult.resultData.last_access_company_no,
				AUTH_A_TOKEN: loginResult.resultData.AUTH_A_TOKEN,
				AUTH_R_TOKEN: loginResult.resultData.AUTH_R_TOKEN,
				HASH_KEY: loginResult.resultData.HASH_KEY,
				// check api data
				profile_url: checkResult.resultData.profile_url,
				user_contact: checkResult.resultData.user_contact,
				user_email: checkResult.resultData.user_email,
				user_name: checkResult.resultData.user_name,
				user_no: checkResult.resultData.user_no,
				employee_list: checkResult.resultData.employee_list, // 회사정보
				last_company: checkResult.resultData.employee_list.filter(
					e => e.company_no == loginResult.resultData.last_access_company_no
				)[0]
			};
			// console.log(' USER : ', userData);

			onLogin(userData);

			navigation.navigate('Home');
		} else {
			this._handleActivateModal();
		}
	};

	/**
	 * _handleLoginForWehago
	 */
	_handleLoginForWehago = () => {
		// alert('준비중입니다.');
		// return;
		Linking.openURL('wehago://?wehagomeet=login').catch(err => {
			alert('일시적인 오류가 발생했습니다. 다시 시도해 주세요');
			console.error('An error occurred', err);
		});
	};

	/**
	 * 
	 */
	_handleGetWehagoToken = event => {
		alert(event.url);
		const result = querystringParser(event.url);
		if (result.type === '3') {
			// 위하고 로그인일 경우
			alert('위하고 인증! Parameter : ' + JSON.stringify(result));
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
	user: state.user.auth,
	permission: state.user.permission
});

// map dispatch to props
let mapDispatchToProps = dispatch => ({
	onLogin: user => dispatch(UserActions.login(user)),
	onAgreement: () => dispatch(UserActions.agreement())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreenContainer);
