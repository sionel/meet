/**
 *
 */

import React, { Component, Fragment } from 'react';
import { View } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingManager from '../../../../../utils/DrawingManager';

class DrawingBoard extends Component {
  constructor(props) {
    super(props);
    this._drawingManager = new DrawingManager();
    // this._drawingManager.set('DRAW_DATA', props.drawData);
    // this._drawingManager.set('BASE_WIDTH', props.rWidth);
    // this._drawingManager.set('BASE_HEIGHT', props.rHeight);
    // this._drawingManager.set('SCALE', props.scale);
  }

  state = {};

  componentDidUpdate = (prevProps, prevState) => {
    console.log('cdup')
    this._drawingManager.drawCanvas(this.props.drawData);
  };

  render() {
    const { user, stroke, color, drawData, rWidth, rHeight, presenter, onStrokeEnd } = this.props;
    this._drawingManager.set('DRAW_DATA', drawData);
    this._drawingManager.set('BASE_WIDTH', rWidth);
    this._drawingManager.set('BASE_HEIGHT', rHeight);
    this._drawingManager.set('SCALE', this.props.scale);
    // const width = this._drawingManager.get('SCREEN_WIDTH');
    // const height = this._drawingManager.get('SCREEN_HEIGHT');
    // const backgroundColor = '#fff';
    const backgroundColor = 'transparent';
    console.log('render')

    return (
      <Fragment>
        <SketchCanvas
          ref={ref => this._drawingManager.setRef(ref)}
          style={{
            width: this.props.rWidth,
            height: this.props.rHeight,
            backgroundColor
            // borderWidth: 2,
            // borderColor: '#d1d1d1'
          }}
          user={user}
          strokeWidth={stroke}
          strokeColor={color}
          touchEnabled={presenter}
          onStrokeEnd={onStrokeEnd}
        />
      </Fragment>
    );
  }

  /**
   *
   */
  // _handleGetDrawingSize = type => {
  //   return {
  //     width: 100,
  //     height: 100
  //   };
  // };
}

DrawingBoard.defaultProps = {
  user: 'user',
  stroke: 1,
  color: '#333',
  onStrokeEnd: rs => console.log('on stroke end : ', rs)
};

export default DrawingBoard;
