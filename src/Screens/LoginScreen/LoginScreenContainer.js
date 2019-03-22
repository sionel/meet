/**
 * LoginScreenContainer
 * 
 * 로그인페이지 컨테이너
 */

import React from 'react';
import { Linking, Platform, NativeModules, View } from 'react-native';

import LoginScreenPresenter from './LoginScreenPresenter';
import LoginFailAlert from './Content/LoginFailAlert';
import { CustomLottie } from '../../components';
// service
import { querystringParser } from '../../utils';

const { PlatformConstants } = NativeModules;

class LoginScreenContainer extends React.Component {
	/**
	 * STATE
	 */
	state = {
		userId: '',
		userPwd: '',
		nextInput: null,
		modal: false,
		modalText: "",
		waiting: true,
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

		this._handleCheckUser();
	}

	componentWillUnmount() {
		Linking.removeEventListener('url', this._handleGetWehagoToken);
	}

	/**
	 * Rendering
	 */
	render() {
		const { permission } = this.props;
		const { list, userId, userPwd, modal, modalText, nextInput, waiting, autoLoginFlag, webView } = this.state;
		if (waiting) {
			return (
				<View style={{ flex: 1 }}>
					<CustomLottie source={'waiting'} width={225} height={225}>
						<LoginFailAlert modal={modal} modalText={modalText} onCancelTryLogin={this._handleCancelTryLogin} />
					</CustomLottie>
				</View>
			);
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
				modalText={this.state.modalText}
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
	_handleCheckUser = async (count = 1) => {
		const { auth, loginCheckRequest } = this.props;
		if (auth.AUTH_A_TOKEN) {
			const copyAuth = JSON.stringify(auth);
			const result = await loginCheckRequest(
				auth.AUTH_A_TOKEN,
				auth.AUTH_R_TOKEN,
				auth.last_access_company_no,
				auth.HASH_KEY
			);

			setTimeout(() => {
				if (result.errors) {
					switch (result.errors.code) {
						case 'E002':
							this.setState({ waiting: false });
							return this._handleActivateModal("토큰이 만료되었습니다. 다시 로그인 해주세요.");
						default:
							if (count < 6 && this.state.waiting) {
								this._handleActivateModal("로그인 실패\n재시도중 (" + count + "/5)");
								return setTimeout(() => {
									this._handleCheckUser(++count);
								}, 1000);
							} else {
								return this.setState({ waiting: false });
							}
					}
				} else {
					return this.props.handleOnLogin();
				}
			}, 1000);
		} else {
			setTimeout(() => {
				return this.setState({ waiting: false });
			}, 1000);
		}
	};

	/**
	 * _handleLogin
	 * 로그인함수
	 */
	_handleLogin = async (wehagoLogin = false) => {
		// const { navigation } = this.props;
		const { userId, userPwd } = this.state;
		const { loginRequest } = this.props;
		const osData =
			Platform.OS === 'ios'
				? {
						login_ip: '127.0.0.1:8081',
						login_device: PlatformConstants.systemName + ' ' + PlatformConstants.interfaceIdiom,
						login_os: PlatformConstants.systemName + ' ' + PlatformConstants.osVersion
					}
				: {
						login_ip: PlatformConstants.ServerHost,
						login_device: PlatformConstants.Model,
						login_os: Platform.OS + ' ' + PlatformConstants.Release
					};
		const data = {
			portal_id: userId,
			portal_password: userPwd,
			login_browser: 'WEHAGO-APP',
			...osData
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
			this._handleActivateModal("아이디와 패스워드를 확인해 주세요");
		}
	};

	_handleCancelTryLogin = () => {
		this.setState({ waiting: false, modal: false });
	}

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
			// navigation.navigate('Home');
			this.props.handleOnLogin();
		}
	};

	/**
	 * _handleLoginForWehago
	 */
	_handleLoginForWehago = () => {
		const url = 'wehago://?wehagomeet=login';
		const iosMarketURL = 'http://itunes.apple.com/kr/app/wehago/id1363039300?mt=8';
		const androidMarketURL = 'https://play.google.com/store/apps/details?id=com.duzon.android.lulubizpotal';

		Linking.openURL(url).catch(err => {
			console.log(err);
			if (Platform.OS === 'ios') {
				Linking.openURL(iosMarketURL).catch(err => {
					alert('스토어 정보가 없습니다.');
				});
			} else if (Platform.OS === 'android') {
				Linking.openURL(androidMarketURL).catch(err => {
					alert('스토어 정보가 없습니다.');
				});
			}
		});
	};

	/**
	 * 
	 */
	_handleGetWehagoToken = event => {
		const result = querystringParser(event.url);
		// Linking.removeEventListener('url', this._handleGetWehagoToken);
		this._handleSaveUserinfo(result.mAuth_a_token, result.mAuth_r_token, result.mHASH_KEY, result.cno);
	};

	/**
	 * _handleActivateModal
	 * 로그인 실패 시 경고 모달 ON
	 */
	_handleActivateModal = (text = "", val = true) => {
		this.setState(prev => ({ modal: val, modalText: text }));
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
