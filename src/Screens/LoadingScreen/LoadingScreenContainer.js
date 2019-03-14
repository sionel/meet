/**
 * LoadingScreenContainer
 * 
 * 로그인페이지 컨테이너
 */

import React from 'react';
import { connect } from 'react-redux';
import { Linking } from 'react-native';
import LoadingScreenPresenter from './LoadingScreenPresenter';
// service
import { UserApi } from '../../services';
import { querystringParser } from '../../utils';

class LoadingScreenContainer extends React.Component {
	/**
	 * 
	 */
	componentDidMount() {
		this._handleCheckUser();
	}

	/**
	 * Rendering
	 */
	render() {
		return (
			<LoadingScreenPresenter />
		);
	} // render

	/**
	 * 유저정보 체크 _handleCheckUser
	 */
	_handleCheckUser = async () => {
		const { user } = this.props;
		if (user) {
			if (user.AUTH_A_TOKEN) {
				const result = await UserApi.check(user.AUTH_A_TOKEN, user.last_access_company_no, user.HASH_KEY);
				if (result.resultCode == 200) {
					return this.props.navigation.navigate('Home');
				}
			}
		}
		this.props.navigation.navigate('Login');
	};

	/**
	 * _handleRedirect
	 * 페이지 이동
	 */
	// _handleRedirect = url => {
	// 	const { navigation } = this.props;
	// 	navigation.navigate(url);
	// };
}

// map state to props
let mapStateToProps = state => ({
	user: state.user.auth
});

export default connect(mapStateToProps)(LoadingScreenContainer);
