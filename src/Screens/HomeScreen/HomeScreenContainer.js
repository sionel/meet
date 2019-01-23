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

// #region

class HomeScreenContainer extends React.Component {
	constructor(props) {
		super(props);
		const { auth } = this.props;
		if (!auth) {
			this._handleRedirect('Login');
		} else {
			this._handleCheckAuth(); // 자동로그인
			this._handleGetWetalkList(); // 위톡목록 조회
		}
	}

	/**
     * STATE
     */
	state = {
		refreshing: false,
		searchKeyword: ''
	};

	// #region
	/**
	 * Rendering
	 */
	render() {
		const { list, refreshing, searchKeyword } = this.state;
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
				list={wetalk}
				auth={auth}
				onRedirect={this._handleRedirect}
				onRefresh={this._handleRefresh}
				onSearch={this._handleSearch}
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
	 * 
	 */
	_handleGetWetalkList = async () => {
		const { auth, onSetWetalkList } = this.props;
		const result = await WetalkApi.getWetalkList(auth.AUTH_A_TOKEN, auth.last_access_company_no);
		onSetWetalkList(result.resultData.roomList);
		this.setState({ refreshing: false });
	};

	/**
	 * _handleRefresh
	 */
	_handleRefresh = () => {
		this.setState({ refreshing: true });
		this._handleGetWetalkList();
	};

	/**
	 * _handleSearch
	 */
	_handleSearch = searchKeyword => {
		this.setState({ searchKeyword });
	};

	/**
	 * _handleCheckAuth
	 */
	_handleCheckAuth = async () => {
		const { auth, onLogin } = this.props;
		let result = await UserApi.check(auth.AUTH_A_TOKEN, auth.last_access_company_no);
		// 자동로그인
		if (result.resultCode !== 200) {
			result = await UserApi.login(data);
			result.resultData.portal_id = auth.portal_id;
			result.resultData.portal_password = auth.portal_password;
			onLogin(result.resultData);
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
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenContainer);
