import React, { Component } from 'react';
import FileSharingPresenter from './FileSharingPresenter';

class FileSharingContainer extends Component {
  state = {
    uri:
      'https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    showTool: true,
    showPreView: true,
    resources: JSON.parse(this.props.attributes.resources),
    page: 0,
  };

  render() {
    return (
      <FileSharingPresenter
        {...this.props}
        {...this.state}
        onChangeState={this._handleChangeState}
      />
    );
  }

  _handleChangeState = state => {
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
