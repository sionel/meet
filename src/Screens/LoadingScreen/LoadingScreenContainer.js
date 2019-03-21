/**
 * LoadingScreenContainer
 * 
 * 로그인페이지 컨테이너
 */

import React from 'react';
import LoadingScreenPresenter from './LoadingScreenPresenter';
import LoginScreen from '../LoginScreen';
// service
import { UserApi } from '../../services';

class LoadingScreenContainer extends React.Component {
	state = { loading: true };
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
		return this.state.loading ? <LoadingScreenPresenter /> : <LoginScreen />;
	} // render

	/**
	 * 유저정보 체크 _handleCheckUser
	 */
	_handleCheckUser = async () => {
		const { user } = this.props;
		if (user) {
			if (user.AUTH_A_TOKEN) {
				const result = await UserApi.check(
					user.AUTH_A_TOKEN,
					user.AUTH_R_TOKEN,
					user.last_access_company_no,
					user.HASH_KEY
				);
				if (result.resultCode == 200) {
					return this.props.navigation.navigate('Home');
				}
			}
		}

		this.setState({ loading: false });
		// this.props.navigation.navigate('Login');
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

export default LoadingScreenContainer;
