/**
 * DrawingContainer
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import DrawingPresenter from './DrawingPresenter';
import DrawingManager from '../../../../utils/DrawingManager';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';

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
    this._initialized = false;
    // 드로잉매니저
    this._drawingManager = new DrawingManager();

    this.subPalette = null;
  }

  /**
   * State
   */
  state = {
    imageLoading: true, // 이미지 정보 로딩
    imgWidth: Dimensions.get('window').width,
    imgHeight: Dimensions.get('window').height,
    // renderImage: null,

    selectedTab: -1,
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
          selectedTab: this.state.selectedTab === 0 ? -1 : 0,
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
          selectedTab: this.state.selectedTab === 1 ? -1 : 1,
          palette: this.state.selectedTab !== 1
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
    // {
    //   id: 'undo',
    //   icon: 'undo',
    //   title: '이전',
    //   // value: [1,2],
    //   onPress: () => {
    //     this._drawingManager.undo();
    //   }
    // }
    // {
    //   id: 'redo',
    //   icon: 'redo',
    //   title: '다시',
    //   // value: [1,2],
    //   onPress: () => {
    //     this._drawingManager.redo();
    //   }
    // }
  ];

  /**
   * LifeCycle
   */
  // componentDidMount = () => {
  // this._handleGetImageSize(this.props.image);
  // console.log('cdm', this.props.image)
  // };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextState.imageLoading !== this.state.imageLoading) return true;
    if (
      nextState.imgWidth !== this.state.imgWidth ||
      nextState.imgHeight !== this.state.imgHeight
    ) {
      return false;
    }
    // if (
    //   nextState.imgWidth !== this.state.imgWidth ||
    //   nextState.imgHeight !== this.state.imgHeight
    // ) {
    //   return true;
    // }
    // if (nextProps.image !== this.props.image) {
    //   // this._handleGetImageSize(nextProps.image);
    //   return true;
    // }
    // if (nextState.selectedTab !== this.state.selectedTab) {
    //   if (this.subPalette) {
    //     this.subPalette.scrollTo({ x: 0, y: 0, animated: false });
    //   }
    // }
    return true;
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedTab !== this.state.selectedTab) {
      if (this.subPalette) {
        this.subPalette.scrollTo({ x: 0, y: 0, animated: false });
      }
    }
  }

  /**
   * Render
   */
  render() {
    const renderImage = (
      <FastImage
        source={{
          uri: this.props.image,
          priority: FastImage.priority.high
        }}
        resizeMode={FastImage.resizeMode.contain}
        onLoadStart={() => this.setState({ imageLoading: true })}
        onLoad={event => {
          this.setState({
            imgWidth: event.nativeEvent.width,
            imgHeight: event.nativeEvent.height
          });
        }}
        onLoadEnd={() => {
          this.setState({ imageLoading: false });
        }}
        style={[
          {
            width: '100%',
            height: '100%'
          }
        ]}
      />
    );

    return (
      <DrawingPresenter
        {...this.state}
        {...this.props}
        tabs={this.tabs}
        renderImage={renderImage}
        onChangeState={this._handleChangeState}
        onStrokeEnd={this._handleStrokeEnd}
        onCanvas={this._handleCanvas}
        onClearAll={this._handleClearAll}
        onSetRef={this._handleSetRef}
      />
    );
  }

  _handleSetRef = (content, ref) => {
    this[content] = ref;
  };

  // _handleGetImageSize = image => {
  //   const renderImage = (
  //     <FastImage
  //       source={{
  //         uri: image,
  //         priority: FastImage.priority.high
  //       }}
  //       resizeMode={FastImage.resizeMode.contain}
  //       onLoad={event => {
  //         this.setState({
  //           imgWidth: event.nativeEvent.width,
  //           imgHeight: event.nativeEvent.height
  //         });
  //       }}
  //       onLoadEnd={() => {
  //         this.setState({ imageLoading: false });
  //       }}
  //       style={[
  //         {
  //           width: '100%',
  //           height: '100%'
  //           // borderColor: 'blue',
  //           // borderWidth: 0
  //         }
  //       ]}
  //     />
  //   );

  //   this.setState({ renderImage });

  //   // Image.getSize(image, (w, h) => {
  //   //   this.setState({ imageLoading: false, imgWidth: w, imgHeight: h });
  //   // });
  // };

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
    // console.log('this.canvas : ', this.canvas);
    // console.log('this.canvas : ', this.ctx);
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
  _handleClearAll = a => {
    // this.props.onClear();
    console.log(a);
  };
}

export default DrawingContainer;
