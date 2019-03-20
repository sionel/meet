/**
 * DrawingContainer
 */

import React, { Component } from 'react';
import DrawingPresenter from './DrawingPresenter';

class DrawingContainer extends Component {
	constructor(props) {
		super(props);
	}

	/**
   * State
   */
	state = {
		selectedColor: 'lightskyblue', // 선택된 색
		selectedStroke: 1, // 선택된 색
		colors: ['lightskyblue', 'orange', 'lime'],
		strokes: [1, 2, 3, 5, 7],
		canvas: null
	};

	/**
    * Render
    */
	render() {
		return (
			<DrawingPresenter
				{...this.state}
				onChangeState={this._handleChangeState}
				onStrokeEnd={this._handleStrokeEnd}
				onCanvas={this._handleCanvas}
			/>
		);
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

	/**
	 * 
	 */
	_handleCanvas = canvas => {
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'purple';
		ctx.fillRect(0, 0, 100, 100);
	};
}

export default DrawingContainer;
