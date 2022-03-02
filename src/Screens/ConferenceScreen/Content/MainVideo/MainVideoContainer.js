import React from 'react';
import { BackHandler, NativeModules, ToastAndroid ,findNodeHandle,NativeEventEmitter} from 'react-native';
import MainVideoPresenter from './MainVideoPresenter';
import { getT } from '../../../../utils/translateManager';
import { getConferenceManager } from '../../../../utils/ConferenceManager';

const { PictureInPicture } = NativeModules;

class MainVideoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time:
        Date.now() - this.props.createdTime > 0
          ? Math.floor(this.props.expireTime !== null ? ((this.props.limitedTime - 500) / 1000) : ((Date.now() - this.props.createdTime) / 1000))
          : 0,
      pipMode: false
    };
    this.t = getT();
  }

  componentDidMount() {
    this._timer = setInterval(() => {
      if (this.props.createdTime) {
        if (this.props.expireTime !== null) {
          let limitTime = this.props.limitedTime - 500;
          let remainTime = Math.floor(limitTime / 1000);
          
          this.setState({ time: remainTime });
          this.props.setLimitedTime(limitTime);

          if (limitTime < 3540000) {
            this.props.onClose();
            Alert.alert('회의 종료', '회의시간이 60분 지나 회의가 종료됩니다.');
          }
          // if (limitTime < 500) {
          //   this.props.onClose();
          //   Alert.alert('회의 종료', '회의시간이 60분 지나 회의가 종료됩니다.');
          // }
        } else {
          let nowTime = Date.now();
          let normalTime = Math.floor((nowTime - this.props.createdTime) / 1000);
          this.state.time > 0 && this.setState({ time: normalTime });
        }
      }
    }, 500);


    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps !== this.props) return true;
    if (nextState !== this.state) return true;
    return false;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._handleBackButton
    );

    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  render() {
    return (
      <MainVideoPresenter
        {...this.props}
        {...this.state}
        setRef={this._setNativeComponent}
        test={this.test}
      />
    );
  }
  _handleBackButton = () => {
    this._handleEnterPIPMode('BACK');

    // 앱 종료를 막는다.
    // true: 대기 / false: 뒤로가기
    return true;
  };

  _handleEnterPIPMode = type => {
    PictureInPicture.enterPictureInPicture().catch(() => {
      // Picture-in-Picture not supported
      // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
      if (type === 'BACK') {
        if (this.exitContent == undefined || !this.exitContent) {
          ToastAndroid.show(this.t('toast_closeapp'), ToastAndroid.SHORT);
          this.exitContent = true;

          this.timeout = setTimeout(() => {
            this.exitContent = false;
          }, 1000);
        } else {
          clearTimeout(this.timeout);
          if (this._timer) {
            clearInterval(this._timer);
          }

          this.props.onClose(); // 컴포넌트 종료
        }
      }
    });
  };
}

export default MainVideoContainer;
