/**
 *
 */

import React, { Component, Fragment } from 'react';
import { Dimensions } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingManager from '../../../../../utils/DrawingManager';

class DrawingBoard extends Component {
  constructor(props) {
    super(props);
    this._drawingManager = new DrawingManager();
    // this._drawingManager.set('BASE_WIDTH', props.width);
    // this._drawingManager.set('BASE_HEIGHT', props.height);
    // this._drawingManager.set('SCREEN_WIDTH', props.rWidth);
    // this._drawingManager.set('SCREEN_HEIGHT', props.rHeight);
  }

  state = {};

  shouldComponentUpdate = (nextProps, nextState) => {
    // if (this.props.orientation !== nextProps.orientation) {
    //   this._drawingManager.resetCanvas(true);
    // }
    return true;
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.orientation !== prevProps.orientation) {
      // this._drawingManager.resetCanvas(true);
    }
  }

  render() {
    const { user, stroke, color, drawData, onStrokeEnd } = this.props;
    this._drawingManager.set('DRAW_DATA', drawData);
    this._drawingManager.set('BASE_WIDTH', this.props.rWidth);
    this._drawingManager.set('BASE_HEIGHT', this.props.rHeight);
    this._drawingManager.set('SCALE', this.props.scale);
    // const width = this._drawingManager.get('SCREEN_WIDTH');
    // const height = this._drawingManager.get('SCREEN_HEIGHT');
    // const backgroundColor = '#fff';
    const backgroundColor = 'transparent';

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
