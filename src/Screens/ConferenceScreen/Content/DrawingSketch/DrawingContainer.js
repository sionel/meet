/**
 * DrawingContainer
 */

import React, { Component } from 'react';
import DrawingPresenter from './DrawingPresenter';

class DrawingContainer extends Component {
	constructor(props) {
		super(props);
		this.canvas = null;
		this.ctx = null;
		this.pos = {
			drawable: false,
			x: -1,
			y: -1
		};
	}

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
	 * 
	 */
	componentDidMount = () => {};

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
	 * 캔버스 등록
	 */
	_handleCanvas = canvas => {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		console.log('this.canvas : ', this.canvas);
		console.log('this.canvas : ', this.ctx);
		// 마우스이벤트 등록
		this.canvas.addMessageListener('mousedown', this._handleDrawListener);
		this.canvas.addMessageListener('mousemove', this._handleDrawListener);
		this.canvas.addMessageListener('mouseup', this._handleDrawListener);
		this.canvas.addMessageListener('mouseout', this._handleDrawListener);

		// this.ctx.fillStyle = '#000000';
		// this.ctx.fillRect(0, 0, 100, 100);
	};

	/**
   * 
   */
	_handleDrawListener = event => {
		alert(1);
		switch (event.type) {
			case 'mousedown':
				this._handleInitDraw(event);
				break;
			case 'mousemove':
				if (this.pos.drawable) {
					this._handleDraw(event);
				}
				break;
			case 'mouseup':
			case 'mouseout':
				this._handleFinishDraw();
				break;
			default:
				break;
		}
	};

	/**
   * 
   */
	_handleInitDraw = event => {
		const coors = this._handleGetPosition(event);
		this.ctx.beginPath();
		this.pos.drawable = true;
		this.pos.X = coors.X;
		this.pos.Y = coors.Y;
		console.log('_handleInitDraw : ', this.pos);
		this.ctx.moveTo(this.pos.X, this.pos.Y);
	};

	/**
   * 
   */
	_handleDraw = event => {
		const coors = this._handleGetPosition(event);
		this.ctx.lineTo(coors.X, coors.Y);
		this.pos.X = coors.X;
		this.pos.Y = coors.Y;
		console.log('_handleDraw : ', this.pos);
		this.ctx.stroke();
	};
	/**
   * 
   */
	_handleFinishDraw = () => {
		this.pos.drawable = false;
		this.pos.X = -1;
		this.pos.Y = -1;
	};

	/**
   * 
   */
	_handleGetPosition = event => {
		const x = event.pageX - this.canvas.offsetLeft;
		const y = event.pageY - this.canvas.offsetTop;
		return { X: x, Y: y };
	};
}

export default DrawingContainer;
