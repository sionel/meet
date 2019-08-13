import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import FileSharingPresenter from './FileSharingPresenter';
import FastImage from 'react-native-fast-image';
import _ from 'underscore';

class FileSharingContainer extends Component {
  constructor(props) {
    super(props);

    this.preView = null;
    this.imageSize = [];
    this.scuTimer = null;

    let imgList = JSON.parse(props.attributes.resources);
    imgList = imgList.map(src => ({
      uri: src,
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.cacheOnly
    }));
    FastImage.preload(imgList);
  }

  state = {
    showTool: true,
    showPreView: true,
    resources: JSON.parse(this.props.attributes.resources),
    modal: false,
    isLoading: true,
    imageSize: null,
    viewWidth: 0,
    viewHeight: 0
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this._handleChangeState('modal');
      return true;
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.page !== this.props.page) {
      if (this.preView) {
        this.preView.scrollTo({
          x: nextProps.page * 78,
          y: 0,
          animated: false
        });
      }
    }

    // debounce 설정
    clearTimeout(this.scuTimer);
    this.scuTimer = setTimeout(() => {
      this._handleForceUpdate();
    }, 1);
    return false;

    // if (nextProps !== this.props) return true;
    // if (nextState !== this.state) return true;

    // return false;
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <FileSharingPresenter
        {...this.props}
        {...this.state}
        onChangeState={this._handleChangeState}
        onChangePage={this._handleChangePage}
        onDisposeConference={this._handleDisposeConference}
        onSetRef={this._handleSetRef}
        onChangeImageSize={this._handleChangeImageSize}
      />
    );
  }

  _handleForceUpdate = () => {
    this.scuTimer = null;
    this.forceUpdate();
  };

  _handleChangeImageSize = (value, index) => {
    const imgLength = this.state.resources.length;
    if (this.imageSize.length !== imgLength) {
      this.imageSize = new Array(imgLength);
    }
    this.imageSize[index] = value;
    if (JSON.stringify(this.imageSize).indexOf('null') < 0) {
      this.setState({ isLoading: false, imageSize: this.imageSize });
    }
  };

  _handleSetRef = (content, ref) => {
    this[content] = ref;
  };

  _handleDisposeConference = () => {
    if (this.props.onClose) this.props.onClose();
  };

  _handleChangePage = (page, presenter) => {
    if (this.props.page !== page)
      this.props.onChangeDocumentPage(page, presenter);
  };

  _handleChangeState = (state, value) => {
    switch (state) {
      case 'showTool':
        this.state.showTool
          ? this.setState({
              showTool: false,
              showPreView: false
            })
          : this.setState({ showTool: true });
        break;
      case 'viewSize':
        this.setState(value);
        break;
      default:
        this.setState({ [state]: !this.state[state] });
    }
  };
}

export default FileSharingContainer;
