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
		Linking.getInitialURL().then(url => {
			if (url) {
				this._handleGetWehagoToken({ url });
			}
		});
		Linking.addEventListener('url', this._handleGetWehagoToken);
		this._handleCheckUser();
	}

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
		return (
			<LoadingScreenPresenter />
		);
	} // render

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
	 * 
	 */
	_handleGetWehagoToken = event => {
		const result = querystringParser(event.url);
		Linking.removeEventListener('url', this._handleGetWehagoToken);
		this._handleSaveUserinfo(result.mAuth_a_token, result.mAuth_r_token, result.mHASH_KEY, result.cno);
	};
}

// map state to props
let mapStateToProps = state => ({
	user: state.user.auth
});

export default connect(mapStateToProps)(LoadingScreenContainer);
