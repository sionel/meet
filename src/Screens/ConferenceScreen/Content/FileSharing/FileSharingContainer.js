import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import FileSharingPresenter from './FileSharingPresenter';
import FastImage from 'react-native-fast-image';

class FileSharingContainer extends Component {
  constructor(props) {
    super(props);

    this.preView = null;

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
    modal: false
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this._handleChangeState('modal');
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.page !== this.props.page) {
      if (this.preView) {
        this.preView.scrollTo({
          x: this.props.page * 78,
          y: 0,
          animated: false
        });
      }
    }
  };

  render() {
    return (
      <FileSharingPresenter
        {...this.props}
        {...this.state}
        onChangeState={this._handleChangeState}
        onChangePage={this._handleChangePage}
        onDisposeConference={this._handleDisposeConference}
        onSetRef={this._handleSetRef}
      />
    );
  }

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
      default:
        this.setState({ [state]: !this.state[state] });
    }
  };
}

export default FileSharingContainer;
