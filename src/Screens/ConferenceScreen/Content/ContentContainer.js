import React from 'react';
import { Dimensions, NativeModules, Platform } from 'react-native';
import ContentPresenter from './ContentPresenter';
import { ConferenceModes } from '../../../utils/Constants';

const { AudioMode } = NativeModules;
/**
 * ContentContainer : 화상대화 화면
 */
class ContentContainer extends React.Component {
	/**
	 * STATE
	 */
	state = {
		orientation: Dimensions.get('window').height > Dimensions.get('window').width ? 'vertical' : 'horizontal',
		isVideoReverse: false,
		speaker: 2
		// drawing: false
	};

	/**
	 * 
	 */
	componentDidMount() {
		// 스피커폰 설정
		this._handleChangeSpeaker(AudioMode.VIDEO_CALL);
	}

	/**
	 * REDNER
	 */
	render() {
		return (
			<ContentPresenter
				{...this.state}
				{...this.props}
				toggleConferenceMode={this._toggleConferenceMode}
				onReverseVideo={this._handleReverseVideo}
				onLayout={this._setOrientation}
				onChangeSpeaker={this._handleChangeSpeaker}
				onChangeState={this._handleChangeState}
			/>
		);
	}

	/**
	 * _handleChangeState 
	 */
	_handleChangeState = (target, value) => {
		this.setState({ [target]: value });
	};

	/**
   * 대화 모드(참여자가 보일지 / 컨트롤 버튼이 보일지) 변경
   */
	_toggleConferenceMode = () => {
		const { setConferenceMode, conferenceMode } = this.props;
		if (conferenceMode === ConferenceModes.CONTROL) {
			setConferenceMode(ConferenceModes.NORMAL);
		} else {
			setConferenceMode(ConferenceModes.CONTROL);
		}
	};

	/**
   * 방향을 지정한다.
   */
	_setOrientation = () => {
		const { orientation } = this.state;
		const currentOrientation =
			Dimensions.get('window').height > Dimensions.get('window').width ? 'vertical' : 'horizontal';
		if (orientation !== currentOrientation) {
			this.setState({ orientation: currentOrientation });
		}
	};

	/**
	 * 카메라 좌우반전
	 */
	_handleReverseVideo = () => {
		this.setState(prev => ({ isVideoReverse: !prev.isVideoReverse }));
	};

	/**
	 * 스피커폰 활성화
	 */
	_handleChangeSpeaker = () => {
		/*
		[ 1(수화기) | 2(스피커) ]
		*/
		const { speaker } = this.state;
		AudioMode.setMode(speaker);
		this.setState(prev => ({ speaker: prev.speaker == 2 ? 1 : 2 }));
	};
}

export default ContentContainer;
