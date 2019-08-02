/**
 *
 */

import React, { Component, Fragment } from 'react';
// import { View } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingManager from '../../../../../utils/DrawingManager';

class DrawingBoard extends Component {
  constructor(props) {
    super(props);
    this._drawingManager = new DrawingManager();
    // this._drawingManager.set('DRAW_DATA', props.documentData);
    // this._drawingManager.set('BASE_WIDTH', props.rWidth);
    // this._drawingManager.set('BASE_HEIGHT', props.rHeight);
    // this._drawingManager.set('SCALE', props.scale);
  }

  state = {};

  componentDidMount = () => {
    let data = this.props.documentData[this.props.page];
    if (!data) data = [];
    this._drawingManager.drawCanvas(data);
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.documentData !== this.props.documentData ||
      nextProps.page !== this.props.page
    )
      return true;
    return false;
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log(2);
    let data = this.props.documentData[this.props.page];
    if (!data) data = [];
    this._drawingManager.drawCanvas(data);
  };

  render() {
    const {
      user,
      image,
      stroke,
      color,
      documentData,
      page,
      rWidth,
      rHeight,
      presenter,
      onStrokeEnd
    } = this.props;
    console.log(1);

    this._drawingManager.set('DRAW_DATA', documentData[page] || []);
    this._drawingManager.set('BASE_WIDTH', rWidth);
    this._drawingManager.set('BASE_HEIGHT', rHeight);
    this._drawingManager.set('SCALE', this.props.scale);
    const backgroundColor = 'transparent';

    return (
      <SketchCanvas
        ref={ref => this._drawingManager.setRef(ref)}
        style={{
          width: rWidth,
          height: rHeight,
          backgroundColor
          // borderWidth: 2,
          // borderColor: '#d1d1d1'
        }}
        user={user}
        strokeWidth={stroke}
        strokeColor={color}
        touchEnabled={presenter === 'localUser'}
        onStrokeEnd={onStrokeEnd}
      />
    );
  }
}

DrawingBoard.defaultProps = {
  user: 'user',
  stroke: 1,
  color: '#333',
  onStrokeEnd: rs => console.log('on stroke end : ', rs)
};

export default DrawingBoard;
