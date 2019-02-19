import React from 'react';
import MainVideoPresenter from './MainVideoPresenter';

/**
 * MainVideoContainer : 화상대화 화면
 */
class MainVideoContainer extends React.Component {
	render() {
		return <MainVideoPresenter {...this.props} />;
		// return <MainVideoPresenter {...this.props} isMuteVideo={false} />;
	}
}

export default MainVideoContainer;
