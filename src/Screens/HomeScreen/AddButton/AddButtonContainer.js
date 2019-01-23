/**
 * AddButtonContainer
 * 추가버튼 컨테이너
 */

import React from 'react';
import AddButtonPresenter from './AddButtonPresenter';

class AddButtonContainer extends React.Component {
	/**
     * STATE
     */
	state = {};

	/**
     * Rendering
     */
	render() {
		return <AddButtonPresenter onClick={this._handleClick} />;
	}

	/**
     * _handleOnChange
     * 입력창 활성화 시 이벤트발생
     */
	_handleClick = value => {
		this.props.onClick('Drawer');
	};
}

export default AddButtonContainer;
