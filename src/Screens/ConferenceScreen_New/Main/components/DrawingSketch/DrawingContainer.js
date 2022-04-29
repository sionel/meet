/**
 * DrawingContainer
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import DrawingPresenter from './DrawingPresenter';
import DrawingManager from '../../../conferenceUtil/DrawingManager';

class DrawingContainer extends Component {
  constructor(props) {
    super(props);
    // this.canvas = null;
    this.ctx = null;
    this.pos = {
      drawable: false,
      x: -1,
      y: -1
    };
    this._initialized = false;
    // 드로잉매니저
    this._drawingManager = new DrawingManager();

    this.subPalette = null;
    this.documentList = null;
    this.isSwipe = false;
  }

  /**
   * State
   */
  state = {
    imageLoading: true, // 이미지 정보 로딩
    selectedTab:
      this.props.mode && this.props.mode === 'drawing' ? 'stroke' : -1,
    selectedColor: 'stroke', // 선택된 색
    // selectedColor: 'lightskyblue', // 선택된 색
    selectedStroke: 0, // 선택된 색
    selctedEraser: 0,
    palette: false, // 탭 사용여부

    stroke: 3,
    color: 1,
    eraser: 0
  };

  tabs = [
    {
      id: 'pointer',
      icon: ['btnLaserNone', 'btnLaserSele'],
      title: '레이저포인터',
      values: [],
      render: () => null,
      onPress: () => {
        this.setState({
          selectedTab: this.state.selectedTab === 'pointer' ? -1 : 'pointer',
          palette: false
        });
      }
    },
    {
      id: 'stroke',
      icon: ['btnEditNone', 'btnEditSele'],
      // icon: ['palette', 'palette'],
      title: '필기툴',
      values: [
        '#fff',
        '#000',
        '#6a6aff',
        '#258cff',
        '#00c8cb',
        '#ffc126',
        '#ff6e26',
        '#f04247'
      ],
      render: backgroundColor => (
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 25,
            backgroundColor
          }}
        />
      ),
      onPress: () => {
        this.setState({
          selectedTab: this.state.selectedTab === 'stroke' ? -1 : 'stroke',
          palette: this.state.selectedTab !== 'stroke'
        });
      }
    }
    // {
    //   id: 'eraser',
    //   icon: 'eraser',
    //   title: '지우개',
    //   // values: [7, 9, 12, 15, 0],
    //   values: [7, 9, 12, 15],
    //   render: size =>
    //     size !== 0 ? (
    //       <View
    //         style={{
    //           width: '97%',
    //           height: size,
    //           backgroundColor: '#777777',
    //           borderRadius: 15
    //         }}
    //       />
    //     ) : (
    //       <Icon name={'trash'} size={15} color={'#e54840'} />
    //     ),
    //   onPress: () => {
    //     this.setState({
    //       selectedTab: this.state.selectedTab === 2 ? -1 : 2,
    //       palette: this.state.selectedTab !== 2
    //     });
    //   }
    // },
  ];

  /**
   * LifeCycle
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.page !== this.props.page) {
      if (this.documentList) {
        this.documentList.scrollTo({
          x: nextProps.viewWidth * nextProps.page,
          y: 0,
          animated: this.isSwipe
        });
      }
      this.isSwipe = false;
    }

    if (nextProps.viewWidth !== this.props.viewWidth) {
      if (this.documentList) {
        this.documentList.scrollTo({
          x: nextProps.viewWidth * nextProps.page,
          y: 0,
          animated: false
        });
      }
    }

    if (nextProps.selectedTab !== nextState.selectedTab) {
      if (this.subPalette) {
        this.subPalette.scrollTo({ x: 0, y: 0, animated: false });
      }
    }

    return true;
  }

  /**
   * Render
   */
  render() {
    return (
      <DrawingPresenter
        {...this.state}
        {...this.props}
        tabs={this.tabs}
        // renderImage={renderImage}
        onChangeState={this._handleChangeState}
        onStrokeEnd={this._handleStrokeEnd}
        // onCanvas={this._handleCanvas}
        onClearAll={this._handleClearAll}
        onSetRef={this._handleSetRef}
        onDrawAction={this._handleDrawAction}
        onScrollViewIsOnLayout={this._handleScrollViewIsOnLayout}
      />
    );
  }

  _handleScrollViewIsOnLayout = () => {
    if (this.documentList) {
      this.documentList.scrollTo({
        x: this.props.viewWidth * this.props.page,
        y: 0,
        animated: false
      });
    }
  };

  // _handleForceUpdate = () => {
  //   this.forceUpdate();
  // };

  _handleSetRef = (content, ref) => {
    this[content] = ref;
  };

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

    // 마우스이벤트 등록
    this.canvas.addMessageListener('mousedown', this._handleDrawListener);
    this.canvas.addMessageListener('mousemove', this._handleDrawListener);
    this.canvas.addMessageListener('mouseup', this._handleDrawListener);
    this.canvas.addMessageListener('mouseout', this._handleDrawListener);
  };

  /**
   *
   */
  _handleDrawListener = event => {
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

  /**
   *
   */
  _handleClearAll = () => {
    this.props.onSetDrawingData();
    this._drawingManager.set('history', []);
    this._drawingManager.clearAll();
  };

  /**
   * Redo / Undo
   */
  _handleDrawAction = action => {
    switch (action) {
      case 'redo':
        this._drawingManager.redo();
        break;
      case 'undo':
        this._drawingManager.undo();
        break;
      default:
        break;
    }
    const data = this._drawingManager.get('DRAW_DATA');
    this.props.onSetDrawingData(data);
  };
}

export default DrawingContainer;
