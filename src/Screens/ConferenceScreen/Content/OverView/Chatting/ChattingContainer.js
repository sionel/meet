import React, { Component } from 'react';
import ChattingPresenter from './ChattingPresenter';
// import ConferenceManager from '../../../../../utils/conference/ConferenceManager';

//TODO: CONFERENCE MANAGER REDUX
class ChattingContainer extends Component {
  constructor(props) {
    super(props);

    this.scrollView = null;
    this.timeout = null;
    this.isEndScroll = true;
  }

  state = { message: '', cdm: false };

  componentDidUpdate(prevProps, prevState) {
    const { messages } = this.props;
    if (prevProps.messages !== messages || prevState.cdm !== this.state.cdm) {
      if (
        messages[messages.length - 1].user === this.props.user.cid ||
        prevProps.messages.length === 0
      ) {
        if (this.scrollView && this.scrollView.scrollToEnd) {
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.scrollView.scrollToEnd();
          }, 0);
        }
      } else if (this.isEndScroll) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.scrollView.scrollToEnd();
        }, 0);
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
        message={this.state.message}
        cdm={this.state.cdm}
        onSetRef={this._handleSetRef}
        onChangeValue={this._handleChangeValue}
        onChangeState={this._handleChangeState}
        onSendTextMessage={this._handleSendTextMessage}
      />
    );
  }

  _handleSetRef = (target, ref) => {
    this[target] = ref;
  };

  _handleChangeValue = (target, value) => {
    this[target] = value;
  };

  _handleChangeState = (target, value) => {
    this.setState({ [target]: value });
  };

  _handleSendTextMessage = () => {
    const { message } = this.state;
    const { conferenceManager } = this.props;
    if (message && message.slice().replace(/(\s*)/g, '') !== '') {
      this.setState({ message: '' }, () => {
        conferenceManager.sendTextMessage(message);
      });
    }
  };
}

export default ChattingContainer;
