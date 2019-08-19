import React, { Component } from 'react';
import ChattingPresenter from './ChattingPresenter';
import ConferenceManager from '../../../../../utils/conference/ConferenceManager';

class ChattingContainer extends Component {
  constructor(props) {
    super(props);

    this.conferenceManager = new ConferenceManager();
  }

  render() {
    // props => messages, hasNotch, orientation
    return <ChattingPresenter {...this.props} />;
  }
}

export default ChattingContainer;
