import React from 'react';
import SubVideoBoxPresenter from './SubVideoBoxPresenter';

class SubVideoBoxContainer extends React.Component {
  render() {
    if (this.props.callType == 2) {
      return null;
    } else {
      return <SubVideoBoxPresenter {...this.props} />;
    }
  }
}

export default SubVideoBoxContainer;
