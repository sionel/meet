/**
 * HomeScreenContainer
 * 화상대화 히스토리 컨테이너
 */

import React from 'react';
import { connect } from 'react-redux';
import HomeScreenPresenter from './HomeScreenPresenter';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';
// service
import { WetalkApi } from '../../services';
import { UserApi } from '../../services';
// import { ConferenceApi } from '../../services';

// #region

class HomeScreenContainer extends React.Component {
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
	 * componentDidMount
	 */
	componentDidMount() {}

	/**
	 * componentWillUnmount
	 */
	componentWillUnmount() {
		this.setState({ modal: false });
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
	 * _handleGetWetalkList
	 * 위톡 조회
	 */
	_handleGetWetalkList = async () => {
		const { auth, onSetWetalkList } = this.props;
		const wetalkList = await WetalkApi.getWetalkList(auth.AUTH_A_TOKEN, auth.last_access_company_no);
		const onairList = await WetalkApi.getOnairList(auth.portal_id, auth.last_access_company_no);
		// 반복길이
		const wetalkListLength = wetalkList.resultData.roomList.length;
		const onairListLength = onairList.resultData.video_room_list.length;

		// on 찾기
		let onairKeyList = {};
		let temp;
		for (let i = 0; i < onairListLength; i = i + 1) {
			temp = onairList.resultData.video_room_list[i];
			onairKeyList[temp.room_id] = temp;
		}

		// 맵핑
		for (let j = 0; j < wetalkListLength; j = j + 1) {
			temp = wetalkList.resultData.roomList[j];
			if (onairKeyList[temp.room_id]) {
				temp.conference = true;
			} else {
				temp.conference = false;
			}
		}
		wetalkList.resultData.roomList.sort((a, b) => b.conference - a.conference);

		// to redux
		onSetWetalkList(wetalkList.resultData.roomList);
		this.setState({ refreshing: false });
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
		if (result.resultCode !== 200) {
			result.resultData.portal_id = auth.portal_id;
			result.resultData.portal_password = auth.portal_password;
			result = await UserApi.login(result);
			onLogin(result.resultData);
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
		// console.log('Auth : ', auth);

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
	_handleCreateConference = selectedRoomId => {
		// room_id, owner_id, owner_name, token, cno
		const { auth } = this.props;
		const bodyData = {
			room_id: selectedRoomId,
			owner_id: auth.portal_id,
			owner_name: '김성훈',
			cno: auth.last_access_company_no,
			ccode: 'biz201703300000011',
			timestamp: 1548384693,
			token: auth.AUTH_A_TOKEN
		};
		// ConferenceApi.create(...bodyData);
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
