/**
 * LoginScreenContainer
 * 
 * 로그인페이지 컨테이너
 */

import React from 'react';
import { Linking, Platform } from 'react-native';
import LoginScreenPresenter from './LoginScreenPresenter';
import { CustomLottie } from '../../components';
// service
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

	componentDidMount() {
		Linking.getInitialURL().then(url => {
			if (url) {
				this._handleGetWehagoToken({ url });
			}
		});
		Linking.addEventListener('url', this._handleGetWehagoToken);
	}

	componentWillUnmount() {
		Linking.removeEventListener('url', this._handleGetWehagoToken);
	}

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
				// onTokenLogin={this.props.onTokenLogin}
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
		// const { navigation } = this.props;
		const { userId, userPwd } = this.state;
		const { loginRequest } = this.props;
		const data = {
			portal_id: userId,
			portal_password: userPwd,
			login_ip: '10.51.114.169',
			login_device: 'iPhone',
			login_os: 'IOS 12.1.2',
			login_browser: 'WEHAGO-APP'
		};
		// result data
		const { resultCode, resultData } = await loginRequest(data);

		if (resultCode === 200) {
			this._handleSaveUserinfo(
				resultData.AUTH_A_TOKEN,
				resultData.AUTH_R_TOKEN,
				resultData.HASH_KEY,
				resultData.last_access_company_no
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

		const { navigation, loginCheckRequest } = this.props;
		const result = await loginCheckRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY);
		if (result) {
			navigation.navigate('Home');
		}
	};

	/**
	 * _handleLoginForWehago
	 */
	_handleLoginForWehago = () => {
		const url = 'wehago://?wehagomeet=login';
		const iosMarketURL = "http://itunes.apple.com/kr/app/wehago/id1363039300?mt=8";
		const androidMarketURL = "https://play.google.com/store/apps/details?id=com/duzon.lulubizpotal";

		Linking.openURL(url).catch(err => {
			console.log(err);
			if (Platform.OS === "ios") {
				Linking.openURL(iosMarketURL).catch(err => {
					alert("스토어 정보가 없습니다.\n" + err);
				});
			} else if (Platform.OS === "android") {
				Linking.openURL(androidMarketURL).catch(err => {
					alert("스토어 정보가 없습니다.\n" + err);
				});
			}
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

export default LoginScreenContainer;
