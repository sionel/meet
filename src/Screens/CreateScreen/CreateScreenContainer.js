/**
 * CreateScreenContainer
 * 
 * 메인페이지
 */

import React from 'react';
import CreateScreenPresenter from './CreateScreenPresenter';

class CreateScreenContainer extends React.Component {
	/**
     * STATE
     */
	state = {};

	/**
     * handleRedirect
     * 페이지 이동
     */
	handleRedirect = url => {
		const { navigation } = this.props;
		navigation.navigate(url);
	};

	/**
	 * Rendering
	 */
	render() {
		const { navigation } = this.props;

		return <CreateScreenPresenter navigation={navigation} />;
	} // render

	/**
	 * _handleChangeValue
	 * 페이지 이동
	 */
	_handleChangeValue = (target, value) => {
		this.setState({ [target]: value });
	};

	/**
	 * _handleLogout
	 * 로그아웃
	 */
	_handleLogout = () => {
		navigation.navigate('Login');
	};
}

export default CreateScreenContainer;
