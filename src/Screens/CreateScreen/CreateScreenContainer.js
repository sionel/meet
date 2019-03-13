/**
 * CreateScreenContainer
 * 
 * 메인페이지
 */

import React, { Component, Fragment } from 'react';
import { AppState, StatusBar, Linking, Platform, NativeModules } from 'react-native';
import CreateScreenPresenter from './CreateScreenPresenter';
// service
import { WetalkApi } from '../../services';
import { UserApi } from '../../services';
import { ConferenceApi } from '../../services';
import { NavigationEvents } from 'react-navigation';
import { querystringParser } from '../../utils';

class CreateScreenContainer extends React.Component {
	/**
	 * STATE
	 */
	state = {
		refreshing: false, // 리프레시 상태
		searchKeyword: '', // 검색인풋
		selectedRoomId: null,
		modal: false,
		url: null
	};

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
			<Fragment>
				<StatusBar barStyle="light-content" />
				{/* <NavigationEvents
					onDidFocus={() => {
						this._isFocus = true;
						this._handleRefressAfterWhile();
					}}
					onDidBlur={() => (this._isFocus = false)}
				/> */}
				<CreateScreenPresenter list={wetalk} onSearch={this._handleSearch} onRedirect={this._handleRedirect} />
			</Fragment>
		);
	} // render

	/**
   * _handleRedirect
   * 페이지 이동
   */
	_handleRedirect = (url, param) => {
		const { navigation } = this.props;
		navigation.navigate(url, param);
	};

	/**
   * _handleSearch
   * 검색 필터
   */
	_handleSearch = searchKeyword => {
		this.setState({ searchKeyword });
	};
}

export default CreateScreenContainer;
