import React from 'react';
import BottomAreaPresenter from './BottomAreaPresenter';

/**
 * BottomAreaContainer
 */
class BottomAreaContainer extends React.Component {
	render() {
		return <BottomAreaPresenter {...this.props} />;
	}
}

export default BottomAreaContainer;
