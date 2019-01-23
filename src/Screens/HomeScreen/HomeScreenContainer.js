/**
 * HomeScreenContainer
 * 화상대화 히스토리 컨테이너
 */

import React from 'react';
import { connect } from 'react-redux';
import HomeScreenPresenter from './HomeScreenPresenter';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';
// service
import { WetalkApi } from '../../services';

class HomeScreenContainer extends React.Component {
	constructor(props) {
		super(props);
		const { auth } = this.props;
		if (!auth) {
			this._handleRedirect('Login');
		} else {
			this._handleGetWetalkList();
		}
	}

	/**
     * STATE
     */
	state = {
		refreshing: false,
		list: [
			{
				key: 'item1',
				active: true,
				title: 'UI/UX',
				count: 5
			},
			{
				key: 'item2',
				active: false,
				title: '플랫폼기획부',
				count: 5
			},
			{
				key: 'item3',
				active: false,
				title: 'DBP본부',
				count: 5
			},
			{
				key: 'item4',
				active: true,
				title: '도우존',
				count: 5
			},
			{
				key: 'item5',
				active: false,
				title: '더존',
				count: 5
			}
		]
	};

	// #region
	/**
	 * Rendering
	 */
	render() {
		const { list, refreshing } = this.state;
		const { navigation, auth, wetalk } = this.props;

		console.log(wetalk);

		return (
			<HomeScreenPresenter
				navigation={navigation}
				refreshing={refreshing}
				list={wetalk}
				auth={auth}
				onRedirect={this._handleRedirect}
				onRefresh={this._handleRefresh}
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
}

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
	onSetWetalkList: list => dispatch(WetalkActions.setList(list))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenContainer);
