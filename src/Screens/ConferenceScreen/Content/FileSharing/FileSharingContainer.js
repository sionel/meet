import React, { Component } from 'react';
import FileSharingPresenter from './FileSharingPresenter';
import ConferenceManager from '../../../../utils/conference/ConferenceManager';

class FileSharingContainer extends Component {
  state = {
    showTool: true,
    showPreView: true,
    resources: JSON.parse(this.props.attributes.resources),
    modal: false
  };

  render() {
    return (
      <FileSharingPresenter
        {...this.props}
        {...this.state}
        onChangeState={this._handleChangeState}
        onChangePage={this._handleChangePage}
        onDisposeConference={this._handleDisposeConference}
      />
    );
  }

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
