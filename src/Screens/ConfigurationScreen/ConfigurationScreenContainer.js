/**
 * ConfigurationScreenContainer
 * 
 * 메인페이지
 */

import React from 'react';
import ConfigurationScreenPresenter from './ConfigurationScreenPresenter';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';

class ConfigurationScreenContainer extends React.Component {
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
		const { list } = this.state;

		return (
			<ConfigurationScreenPresenter
				navigation={navigation}
				list={list}
				onRedirect={this.handleRedirect}
				onLogout={this._handleLogout}
			/>
		);
	} // render

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

const mapStateToProps = state => ({
	user: state.user.auth
});

const mapDispatchTopProps = dispatch => ({
	onLogout: () => dispatch(UserActions.logout())
});

export default connect(mapStateToProps, mapDispatchTopProps)(ConfigurationScreenContainer);
