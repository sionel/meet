import React from 'react';
import MainVideoPresenter from './MainVideoPresenter';

/**
 * MainVideoContainer : 화상대화 화면
 */
class MainVideoContainer extends React.Component {
	state = {
		time: 0
	};
	componentDidMount() {
		this._timer = setInterval(() => {
			this.setState({
				time: this.state.time + 1
			});
		}, 1000);
	}

	componentWillUnmount() {
		if (this._timer) {
			clearInterval(this._timer);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.isMuteVideo !== this.props.isMuteVideo ||
			// nextProps.stream !== this.props.stream ||
			// nextProps.videoType !== this.props.videoType ||
			// nextProps.mainUser !== this.props.mainUser ||
			nextProps.callType !== this.props.callType ||
			nextState.time !== this.state.time) {
				console.log('render');
				return true;
			}
		else {
			console.log('something is changed');
			return false
		};
	}
	

	render() {
		console.log('RENDERING');
		return <MainVideoPresenter {...this.props} time={this.state.time} />;
		// return <MainVideoPresenter {...this.props} isMuteVideo={false} />;
	}
}

export default MainVideoContainer;
