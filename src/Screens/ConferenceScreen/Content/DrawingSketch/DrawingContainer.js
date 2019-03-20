/**
 * DrawingContainer
 */

import React, { Component } from 'react';
import DrawingPresenter from './DrawingPresenter';

class DrawingContainer extends Component {
	/**
   * State
   */
	state = {
		selectedColor: 'lightskyblue', // 선택된 색
		selectedStroke: 1, // 선택된 색
		colors: ['lightskyblue', 'orange', 'lime'],
		strokes: [1, 2, 3, 5, 7]
	};

	/**
    * Render
    */
	render() {
		return <DrawingPresenter onChangeState={this._handleChangeState} onStrokeEnd={this._handleStrokeEnd} />;
	}

	/**
	 * onChangeColor
	 */
	_handleChangeState = (target, value) => {
		this.setState({ [target]: value });
	};

	/**
	 * _handleStrokeEnd
	 */
	_handleStrokeEnd = rs => {
		console.log('onStrokeEnd : ', rs);
	};
}

export default DrawingContainer;
