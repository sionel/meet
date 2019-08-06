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
    this._drawingManager.set('DRAW_DATA', props.documentData);
    this._drawingManager.set('BASE_WIDTH', props.rWidth);
    this._drawingManager.set('BASE_HEIGHT', props.rHeight);
    this._drawingManager.set('SCALE', props.scale);
  }

  state = {};

  componentDidMount = () => {
    let data = this.props.documentData[this.props.page];
    if (!data) data = [];
    this._drawingManager.drawCanvas(data);
  };

  componentWillReceiveProps = nextProps => {
    this._drawingManager.set(
      'DRAW_DATA',
      nextProps.documentData[nextProps.page] || []
    );
    this._drawingManager.set('BASE_WIDTH', nextProps.rWidth);
    this._drawingManager.set('BASE_HEIGHT', nextProps.rHeight);
    this._drawingManager.set('SCALE', nextProps.scale);
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) return true;
    //   if (
    //     nextProps.documentData !== this.props.documentData ||
    //     nextProps.page !== this.props.page ||
    //     nextProps.width !== this.props.width ||
    //     nextProps.height!== this.props.height ||
    //     nextProps.rWidth !== this.props.rWidth ||
    //     nextProps.rHeight !== this.props.rHeight
    //   ) {
    //     this._drawingManager.set('DRAW_DATA', nextProps.documentData[nextProps.page] || []);
    //     this._drawingManager.set('BASE_WIDTH', nextProps.rWidth);
    //     this._drawingManager.set('BASE_HEIGHT', nextProps.rHeight);
    //     this._drawingManager.set('SCALE', nextProps.scale);

    //     this._drawingManager.drawCanvas(nextProps.documentData[nextProps.page]||[]);
    //     // return true;
    //   }
    return false;
  }

  componentDidUpdate = (prevProps, prevState) => {
    let data = this.props.documentData[this.props.page];
    if (!data) data = [];
    this._drawingManager.drawCanvas(data);
  };

  render() {
    const {
      mode,
      user,
      stroke,
      color,
      documentData,
      page,
      width,
      rWidth,
      rHeight,
      presenter,
      onStrokeEnd
    } = this.props;

    // this._drawingManager.set('DRAW_DATA', documentData[page] || []);
    // this._drawingManager.set('BASE_WIDTH', rWidth);
    // this._drawingManager.set('BASE_HEIGHT', rHeight);
    // this._drawingManager.set('SCALE', this.props.scale);
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
        touchEnabled={presenter === 'localUser' && mode}
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
