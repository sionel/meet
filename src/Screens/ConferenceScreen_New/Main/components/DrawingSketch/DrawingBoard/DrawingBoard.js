/**
 *
 */

import React, { Component, Fragment } from 'react';
// import { View } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingManager from '@utils/DrawingManager';

class DrawingBoard extends Component {
  constructor(props) {
    super(props);
    this._drawingManager = new DrawingManager();
    this._drawingManager.set('DRAW_DATA', props.documentData);
    this._drawingManager.set('BASE_WIDTH', props.rWidth);
    this._drawingManager.set('BASE_HEIGHT', props.rHeight);
    this._drawingManager.set('SCALE', props.scale);
  }

  componentDidMount = () => {
    let data = this.props.documentData[this.props.page];
    if (!data || data.length === 0) data = [];
    this._drawingManager.drawCanvas(data);
  };

  componentWillReceiveProps = nextProps => {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) return true;
    if (nextState !== this.state) return true;
    return false;
  }

  componentDidUpdate = (prevProps, prevState) => {
    let data = this.props.documentData[this.props.page];
    this._drawingManager.set(
      'DRAW_DATA',
      this.props.documentData[this.props.page] || []
    );
    this._drawingManager.set('BASE_WIDTH', this.props.rWidth);
    this._drawingManager.set('BASE_HEIGHT', this.props.rHeight);
    this._drawingManager.set('SCALE', this.props.scale);
    if (!data || data.length === 0) {
      data = [];
    }

    // FIXME This code is dog pan. Thank you.
    data.object && (data = data.object);

    if (this.props.presenter === 'localUser') {
      if (
        this.props.page !== prevProps.page ||
        this.props.rWidth !== prevProps.rWidth
      ) {
        this._drawingManager.drawCanvas(data);
      }
    } else {
      this._drawingManager.drawCanvas(data);
    }
  };

  render() {
    const {
      customStyle,
      mode,
      user,
      stroke,
      color,
      documentData,
      page,
      rWidth,
      rHeight,
      presenter,
      onStrokeEnd
    } = this.props;

    const backgroundColor = 'transparent';

    return (
      <SketchCanvas
        ref={ref => this._drawingManager.setRef(ref)}
        style={{
          width: rWidth,
          height: rHeight,
          backgroundColor,
          ...customStyle
        }}
        user={user}
        strokeWidth={stroke}
        strokeColor={color}
        touchEnabled={presenter === 'localUser' && mode}
        onStrokeEnd={data => {
          onStrokeEnd(data);
          this._drawingManager.set('history', []);
        }}
      />
    );
  }
}

DrawingBoard.defaultProps = {
  customStyle: {},
  user: 'user',
  stroke: 1,
  color: '#333',
  onStrokeEnd: rs => console.log('on stroke end : ', rs)
};

export default DrawingBoard;
