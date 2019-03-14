/**
 * ConfigurationScreenContainer
 * 
 * 메인페이지
 */

import React from 'react';
import ConfigurationScreenPresenter from './ConfigurationScreenPresenter';

class ConfigurationScreenContainer extends React.Component {
	/**
     * STATE
     */
	state = {
		webView: false
	};

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
		const { navigation, onDestroyToken } = this.props;
		const { list, webView } = this.state;

		return (
			<ConfigurationScreenPresenter
				navigation={navigation}
				list={list}
				webView={webView}
				onRedirect={this.handleRedirect}
				onLogout={this._handleLogout}
				onChangeValue={this._handleChangeValue}
				onDestroyToken={onDestroyToken}
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
	 * _handleLogout
	 * 로그아웃
	 */
	_handleLogout = () => {
		const { onLogout, navigation } = this.props;
		onLogout();
		navigation.navigate('Login');
	};
}

export default ConfigurationScreenContainer;
