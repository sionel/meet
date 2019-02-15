/**
 * HomeScreenContainer
 * 화상대화 히스토리 컨테이너
 */

import React, { Component, Fragment } from 'react';
import { AppState, StatusBar, Linking } from 'react-native';
import { connect } from 'react-redux';
import HomeScreenPresenter from './HomeScreenPresenter';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';
// service
import { WetalkApi } from '../../services';
import { UserApi } from '../../services';
import { ConferenceApi } from '../../services';
import { NavigationEvents } from 'react-navigation';
import { querystringParser } from '../../utils';

// #region

class HomeScreenContainer extends Component {
	/**
   * constructor
   */
	constructor(props) {
		super(props);
		this._isFocus = true;
		this._refreshTimeStamp = Date.now();
		// Linking.addEventListener('url', this._handleOpenURL);
		this._handleRefresh();
	}

	/**
   * STATE
   */
	state = {
		appState: AppState.currentState,
		refreshing: false, // 리프레시 상태
		searchKeyword: '', // 검색인풋
		selectedRoomId: null,
		modal: false
	};

	/**
   * componentDidMount
   */
	componentDidMount() {
		this._handleOpenDeepLink();
		AppState.addEventListener('change', this._handleAppStateChange);
		setInterval(() => {
			if (Date.now() > this._refreshTimeStamp + 3000) {
				// 리프레쉬 할 시간이 지났으면 리프레쉬 한다.
				this._handleRefresh();
			}
		}, 15000);
	}

	/**
   * componentWillUnmount
   */
	componentWillUnmount() {
		// Linking.removeEventListener('url', this._handleOpenURL);
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	// #region
	/**
   * Rendering
   */
	render() {
		const { refreshing, searchKeyword, selectedRoomId, modal } = this.state;
		const { navigation, auth } = this.props;
		let wetalk = []; // We talk list

		if (searchKeyword) {
			wetalk = this.props.wetalk.filter(item => item.room_title.match(searchKeyword));
		} else {
			wetalk = this.props.wetalk;
		}

		return (
			<Fragment>
				<StatusBar barStyle="light-content" />
				<NavigationEvents
					onDidFocus={() => {
						this._isFocus = true;
						this._handleRefressAfterWhile();
					}}
					onDidBlur={() => (this._isFocus = false)}
				/>
				<HomeScreenPresenter
					navigation={navigation}
					refreshing={refreshing}
					modal={modal}
					list={wetalk}
					auth={auth}
					selectedRoomId={selectedRoomId}
					onActivateModal={this._handleActivateModal}
					onRedirect={this._handleRedirect}
					onRefresh={this._handleRefresh}
					onSearch={this._handleSearch}
					onCreateConference={this._handleCreateConference}
					onCheckConference={this._handleCheckConference}
				/>
			</Fragment>
		);
	}
	// #endregion

	/**
	 * _handleOpenURL
	 */
	_handleOpenURL(event) {
		console.log('event.url : ', event.url);
	}

	/**
	 * _handleOpenDeepLink
	 * 딥링크접속 시 테스트
	 */
	_handleOpenDeepLink() {
		Linking.getInitialURL()
			.then(url => {
				if (url) {
					const result = querystringParser(url);
					// 화상대화 타입 (생성:0/참여:1)
					if (result.type == '1') {
						this._handleCheckConference(result.room_id, result);
					} else {
						this._handleCreateConference(result.room_id, result);
					}
				}
			})
			.catch(err => alert('다시 시도해 주세요') /* console.error('An error occurred', err) */);
	}

	/**
   * _handleRedirect
   * 페이지 이동
   */
	_handleRedirect = (url, param) => {
		const { navigation } = this.props;
		navigation.navigate(url, param);
	};

	/**
   * _handleSearch
   * 검색 필터
   */
	_handleSearch = searchKeyword => {
		this.setState({ searchKeyword });
	};

	/**
	 * 
	 * 
	 */
	_handleRefressAfterWhile = () => {
		setTimeout(this._handleRefresh, 250);
	};

	/**
   * _handleRefresh
   * 리프레시
   */
	_handleRefresh = () => {
		if (AppState.currentState === 'active' && this._isFocus) {
			this._refreshTimeStamp = Date.now();
			this.setState({ refreshing: true });
			this._handleAutoLogin();
		}
	};

	/**
   * _handleGetWetalkList
   * 위톡 조회
   */
	_handleGetWetalkList = async () => {
		const { auth, onSetWetalkList } = this.props;

		// 위톡조회 API
		const wetalkList = await WetalkApi.getWetalkList(
			auth.AUTH_A_TOKEN,
			auth.last_access_company_no,
			auth.portal_id
		);

		// 토큰만료시
		if (wetalkList.errors) {
			return this._handleAutoLogin();
		}
		this.setState({ refreshing: false });
		onSetWetalkList(wetalkList.resultData.video_room_list);
	};

	/**
	 * _handleAutoLogin
	 * 접속자확인 및 자동로그인
	 */
	_handleAutoLogin = async () => {
		const { auth, onLogin, navigation } = this.props;
		let checkResult,
			loginResult,
			userData = {};

		// 재 로그인이 필요한 경우 (저장된 정보가 없을 경우)
		if (!auth || (!auth.portal_id && !auth.portal_password)) {
			return this._handleRedirect('Login');
		}

		// 접속자 확인
		checkResult = await UserApi.check(auth.AUTH_A_TOKEN, auth.last_access_company_no);
		// 재 로그인
		if (checkResult.errors) {
			loginResult = await UserApi.login(auth);

			if (loginResult.resultCode !== 200) {
				alert('다시 로그인!');
				return navigation.navigate('Login');
			}

			checkResult = await UserApi.check(
				loginResult.resultData.AUTH_A_TOKEN,
				loginResult.resultData.last_access_company_no
			);
			userData = {
				...auth,
				AUTH_A_TOKEN: loginResult.resultData.AUTH_A_TOKEN,
				AUTH_R_TOKEN: loginResult.resultData.AUTH_R_TOKEN,
				last_access_company_no: checkResult.resultData.last_access_company_no,
				last_company: checkResult.resultData.employee_list.filter(
					e => e.company_no == checkResult.resultData.last_access_company_no
				)[0]
			};
			onLogin(userData);
		} else {
			// 최종선택 회사가 달라진 경우
			if (auth.last_access_company_no != checkResult.resultData.last_access_company_no) {
				userData = {
					...auth,
					last_access_company_no: checkResult.resultData.last_access_company_no,
					last_company: checkResult.resultData.employee_list.filter(
						e => e.company_no == checkResult.resultData.last_access_company_no
					)[0]
				};
				onLogin(userData);
			}
		}
		this._handleGetWetalkList();
	};

	/**
   * _handleActivateModal
   * 모달뷰 토글
   */
	_handleActivateModal = async (selectedRoomId = null) => {
		this.setState(prev => ({
			modal: !prev.modal,
			selectedRoomId
		}));
	};

	/**
   * _handleActivateModal
   * 모달뷰 토글
   */
	_handleCheckConference = async (conferenceId, externalData = null) => {
		let { auth } = this.props;
		// 위하고에서 접속인지 아닌지 구분
		if (externalData !== null) {
			auth = {
				conferenceId,
				portal_id: externalData.owner_id,
				user_name: externalData.owner_name,
				last_access_company_no: externalData.cno,
				AUTH_A_TOKEN: externalData.access
			};
		}
		const result = await ConferenceApi.check(conferenceId, auth.AUTH_A_TOKEN);
		if (!result.resultData) {
			alert('이미 종료된 대화방입니다.');
			return;
		}
		this._handleRedirect('Conference', { item: { videoRoomId: conferenceId } });
	};

	/**
   * _handleCreateConference
   */
	_handleCreateConference = async (selectedRoomId, externalData = null) => {
		let { auth } = this.props;
		// 위하고에서 접속인지 아닌지 구분
		if (externalData !== null) {
			auth = {
				selectedRoomId,
				portal_id: externalData.owner_id,
				user_name: externalData.owner_name,
				last_access_company_no: externalData.cno,
				AUTH_A_TOKEN: externalData.access
			};
		}
		console.log('externalData : ', auth);

		const company_code = auth.employee_list.filter(e => e.company_no == auth.last_access_company_no)[0]
			.company_code;

		const bodyData = [
			selectedRoomId, // 방 id
			auth.portal_id, // 유저아이디
			auth.user_name, // 유저이름
			auth.last_access_company_no, // 회사번호
			company_code, // 회사코드
			auth.AUTH_A_TOKEN // 토큰
		];
		const createResult = await ConferenceApi.create(...bodyData);

		// 화상대화 생성가능여부
		if (createResult.resultCode === 200) {
			// 생성완료 메시지 보내기
			const sendWetalkResult = await ConferenceApi.sendWetalk(
				selectedRoomId,
				createResult.resultData,
				auth.last_access_company_no,
				company_code,
				auth.AUTH_A_TOKEN
			);
			this.setState({ modal: false });

			// 대화방에 참여한다.
			const videoRoomId = sendWetalkResult.resultData.chatList[0].mobile_key;
			this._handleRedirect('Conference', { item: { videoRoomId } });
		} else {
			alert('화상대화 생성에 실패하였습니다. 다시 시도해 주세요');
		}
	};

	/**
   * _handleAppStateChange
   * 포그라운드 전환 시 상태변환
   */
	_handleAppStateChange = nextAppState => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			// 포그라운드 전환시 아래 로직 실행
			this._handleRefressAfterWhile();
		}
		this.setState({ appState: nextAppState });
	};
}
// #endregion

/**
 * Connect - State to Props
 */
let mapStateToProps = state => ({
	auth: state.user.auth,
	wetalk: state.wetalk.list
});

/**
 * Connect - Dispatch to Props
 */
const mapDispatchToProps = dispatch => ({
	onLogin: user => dispatch(UserActions.login(user)),
	onSetWetalkList: list => dispatch(WetalkActions.setList(list))
	// onCreateConference: bodyData => dispatch(ConferenceActions.createConference(...bodyData))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenContainer);
