import React, { Component } from 'react';
import ChattingPresenter from './ChattingPresenter';
import ConferenceManager from '../../../../../utils/conference/ConferenceManager';

class ChattingContainer extends Component {
  constructor(props) {
    super(props);

    this.conferenceManager = new ConferenceManager();
    this.scrollView = null;
    this.timeout = null;
  }

  state = { message: '' };

  componentDidMount = () => {
    if (this.scrollView && this.scrollView.scrollToEnd) {
      this.timeout = setTimeout(() => {
        // scrollToEnd 가 나중에 실행되도록 해야 잘됨
        // 이러면 scrollView 마지막 컴포넌트 업데이트하고 스크롤 내리도록 되던데?
        this.scrollView.scrollToEnd();
      }, 0);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { messages } = this.props;
    if (prevProps.messages !== messages) {
      if (
        messages[messages.length - 1].user === this.props.user.cid ||
        prevProps.messages.length === 0
      ) {
        if (this.scrollView && this.scrollView.scrollToEnd && this.timeout) {
          this.timeout = setTimeout(() => {
            this.scrollView.scrollToEnd();
          }, 0);
        }
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <ChattingPresenter
        {...this.props}
        {...this.state}
        onSetRef={this._handleSetRef}
        onChangeState={this._handleChangeState}
        onSendTextMessage={this._handleSendTextMessage}
      />
    );
  }

  _handleSetRef = (target, ref) => {
    this[target] = ref;
  };

  _handleChangeState = (target, value) => {
    this.setState({ [target]: value });
  };

  _handleSendTextMessage = () => {
    const { message } = this.state;
    if (message && message !== '') {
      this.setState({ message: '' }, () => {
        this.conferenceManager.sendTextMessage(message);
      });
    }
  };
}

export default ChattingContainer;
