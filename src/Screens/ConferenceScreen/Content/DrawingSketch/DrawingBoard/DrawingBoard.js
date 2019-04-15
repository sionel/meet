/**
 *
 */

import React, { Component, Fragment } from 'react';
import { Dimensions } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import Orientation from 'react-native-orientation-locker';
import DrawingManager from '../../../../../utils/DrawingManager';

class DrawingBoard extends Component {
  constructor(props) {
    super(props);
    this._drawingManager = new DrawingManager();
  }

  state = {};

  render() {
    const { user, stroke, color, onStrokeEnd } = this.props;
    const width = Dimensions.get('window').width; // 화면 가로길이
    const height = width * ((521 * 100) / 910 / 100); // 웹에서 받아온 데이터의 화면과 비례한 세로길이
    const backgroundColor = '#fff';

    console.log('onSetDrawingData : ', onStrokeEnd);

    return (
      <Fragment>
        <SketchCanvas
          ref={ref => this._drawingManager.setRef(ref)}
          style={{
            width,
            height,
            backgroundColor
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
