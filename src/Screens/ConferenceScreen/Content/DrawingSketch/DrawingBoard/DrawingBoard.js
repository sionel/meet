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
  }

  state = {};

  render() {
    const { user, stroke, color, onStrokeEnd } = this.props;
    const width = this._drawingManager.get('SCREEN_WIDTH');
    const height = this._drawingManager.get('SCREEN_HEIGHT');
    // const backgroundColor = '#fff';
    const backgroundColor = 'transparent';

    return (
      <Fragment>
        <SketchCanvas
          ref={ref => this._drawingManager.setRef(ref)}
          style={{
            width,
            height,
            backgroundColor,
            borderWidth: 2,
            borderColor: '#d1d1d1'
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
  _handleGetDrawingSize = type => {
    return {
      width: 100,
      height: 100
    };
  };
}

DrawingBoard.defaultProps = {
  user: 'user',
  stroke: 1,
  color: '#333',
  onStrokeEnd: rs => console.log('on stroke end : ', rs)
};

export default DrawingBoard;
