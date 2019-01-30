/**
 * HomeScreenContainer
 * 화상대화 히스토리 컨테이너
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeScreenPresenter from './HomeScreenPresenter';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';
// service
import { WetalkApi } from '../../services';
import { UserApi } from '../../services';
import { ConferenceApi } from '../../services';

// #region

class HomeScreenContainer extends Component {
	/**
	 * constructor
	 */
	constructor(props) {
		super(props);
		this._handleAutoLogin();
	}

	/**
	 * STATE
	 */
	state = {
		refreshing: false, // 리프레시 상태
		searchKeyword: '', // 검색인풋
		selectedRoomId: null,
		modal: false
	};

	/**
	 * componentWillUnmount
	 */
	componentWillUnmount() {
		this.setState({ modal: false });
	}

	/**
	 * componentDidMount
	 */
	componentDidMount() {
		this._handleRefresh();
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
			/>
		);
	}
	// #endregion

	/**
	 * _handleRedirect
	 * 페이지 이동
	 */
	_handleRedirect = url => {
		const { navigation } = this.props;
		navigation.navigate(url);
	};

	/**
	 * _handleRefresh
	 * 리프레시 
	 */
	_handleRefresh = () => {
		this.setState({ refreshing: true });
		this._handleGetWetalkList();
	};

	/**
	 * _handleGetWetalkList
	 * 위톡 조회
	 */
	_handleGetWetalkList = async () => {
		const { auth, onSetWetalkList } = this.props;
		const wetalkList = await WetalkApi.getWetalkList(
			auth.AUTH_A_TOKEN,
			auth.last_access_company_no,
			auth.portal_id
		);
		console.log('wetalkList : ', wetalkList);

		// to redux
		onSetWetalkList(wetalkList.resultData.video_room_list);
		this.setState({ refreshing: false });
	};

	/**
	 * _handleSearch
	 * 검색 필터
	 */
	_handleSearch = searchKeyword => {
		this.setState({ searchKeyword });
	};

	/**
	 * _handleCheckAuth
	 * 접속자 확인
	 */
	_handleCheckAuth = async () => {
		const { auth, onLogin } = this.props;
		let result = await UserApi.check(auth.AUTH_A_TOKEN, auth.last_access_company_no);
		// 자동로그인
		if (result.errors) {
			result = await UserApi.login(auth);
			// get user data API
			const checkResult = await UserApi.check(
				loginResult.resultData.AUTH_A_TOKEN,
				loginResult.resultData.last_access_company_no
			);
			// 유저정보
			const userData = {
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
				employee_list: checkResult.employee_list // 회사정보
			};
			onLogin(userData);
		}
	};

	/**
	 * _handleActivateModal
	 * 모달뷰 토글
	 */
	_handleActivateModal = (selectedRoomId = null) => {
		this.setState(prev => ({
			modal: !prev.modal,
			selectedRoomId
		}));
	};

	/**
	 * _handleAutoLogin
	 * 자동로그인
	 */
	_handleAutoLogin = () => {
		const { auth } = this.props;
		// console.log('AUTH : ', auth);

		// 접속확인
		if (!auth) {
			this._handleRedirect('Login');
		} else {
			this._handleCheckAuth(); // 자동로그인
		}
	};

	/**
	 * _handleCreateConference
	 */
	_handleCreateConference = async selectedRoomId => {
		// room_id, owner_id, owner_name, token, cno
		const { auth } = this.props;
		// const company_code = await auth.employee_list.filter(e => e.company_no === auth.last_access_company_no)[0].company_code
		const company_code = auth.employee_list.filter(e => e.company_no == auth.last_access_company_no)[0]
			.company_code;
		console.log(company_code);

		const bodyData = [
			// 방 id
			selectedRoomId,
			// 유저아이디
			auth.portal_id,
			// 유저이름
			auth.user_name,
			// 회사번호
			auth.last_access_company_no,
			// 회사코드
			company_code,
			// 시간
			'1548384693',
			// 토큰
			auth.AUTH_A_TOKEN
		];
		console.log(bodyData);

		const createResult = await ConferenceApi.create(...bodyData);
		console.log('createResult : ', createResult);

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
			console.log('sendWetalkResult : ', sendWetalkResult);
			// this._handleActivateModal();
			this.setState({ modal: false });
		} else {
			alert('화상대화 생성에 실패하였습니다. 다시 시도해 주세요');
		}
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
