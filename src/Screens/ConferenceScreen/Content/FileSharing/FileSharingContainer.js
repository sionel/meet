import React, { Component } from 'react';
import { BackHandler, Dimensions } from 'react-native';
import FileSharingPresenter from './FileSharingPresenter';
import FastImage from 'react-native-fast-image';
import _ from 'underscore';

const previewWidth = 78;

class FileSharingContainer extends Component {
  constructor(props) {
    super(props);

    this.preView = null;
    this.imageSize = [];
    this.scuTimer = null;
    this.scrollX = {
      start: 0, // 화면에 보이기 시작하는 지점
      here: previewWidth // 여기까지는 보여야 하는 지점
    };

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
    if (nextProps.attributes.resources !== this.props.attributes.resources) {
      this.setState({ resources: JSON.parse(nextProps.attributes.resources) });
      return false;
    }

    if (nextProps.page !== this.props.page) {
      if (this.preView) {
        const { width } = Dimensions.get('window');
        const raise = nextProps.page > this.props.page;
        this.scrollX.here = (nextProps.page + 1) * previewWidth;

        if (raise) {
          // 페이지가 증가했을 경우
          // 현재 커서 위치 + 화면 크기 < 보여야하는 지점
          // => 보여야하는 지점이 화면 이후로 넘어갈 때 스크롤(커서) 이동
          if (this.scrollX.start + width < this.scrollX.here) {
            const gap = this.scrollX.here - (this.scrollX.start + width);
            this.scrollX.start += gap + 10;
            this.preView.scrollTo({
              x: this.scrollX.start,
              y: 0,
              animated: false
            });
          }
        } else {
          // 페이지가 감소했을 경우
          // 현재 커서 위치 > 보여야하는 지점
          // => 보여야하는 지점이 화면 이전으로 넘어갈 때 스크롤(커서) 이동
          if (this.scrollX.start > this.scrollX.here - previewWidth) {
            this.scrollX.start = nextProps.page * previewWidth;
            this.preView.scrollTo({
              x: this.scrollX.start,
              y: 0,
              animated: false
            });
          }
        }
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
