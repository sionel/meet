import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import buttonTalk from '../../../../../../assets/buttons/btn_tnavi_talk_none.png';
import buttonSetting from '../../../../../../assets/buttons/btn_tnavi_setting_none.png';
import buttonDocshare from '../../../../../../assets/buttons/btn_tnavi_docshare_none.png';
// import buttonToggleScreen from '../../../../../../assets/buttons/btn_tnavi_swscreen_none.png';
import buttonToggleScreen from '../../../../../../assets/buttons/btnTnaviSwscreenNone_3x.png';
import buttonReverseVideo from '../../../../../../assets/buttons/btn_video_reverse.png';
import buttonPen from '../../../../../../assets/buttons/btn_pen.png';
import buttonZoomIn from '../../../../../../assets/buttons/zoom_in.png';
import buttonZoomOut from '../../../../../../assets/buttons/zoom_out.png';
import buttonDocShare from '../../../../../../assets/buttons/doc_share_3x.png';
import buttonClose from '../../../../../../assets/buttons/btnTnaviCloseNone_3x.png';
import btnArrowUp from '../../../../../../assets/buttons/btnArrowUp.png';
import btnArrowDown from '../../../../../../assets/buttons/btnArrowDown.png';
/**
 * SettingButtonPresenter
 */
const SettingButtonPresenter = props => (
  <TouchableOpacity
    style={{
      ...styles.bottonTouch,
      ...props.style,
      width: props.areaWidth,
      height: props.areaHeight
    }}
    onPress={props.onPress}
  >
    <Image
      source={getButtonSource(props.name)}
      resizeMode={'contain'}
      style={{
        ...styles.buttonImage,
        width: props.width,
        height: props.height
      }}
    />
  </TouchableOpacity>
);

/**
 * SettingButtonPresenter PropTypes
 */
SettingButtonPresenter.propTypes = {
  // 버튼 이름입니다.
  name: PropTypes.oneOf([
    'talk',
    'setting',
    'share',
    'switch',
    'reverse',
    'pen',
    'zoomIn',
    'zoomOut',
    'docShare',
    'buttonClose',
    'btnArrowUp',
    'btnArrowDown',
  ]).isRequired,
  // 버튼이 클릭되면 발생하는 이벤트 입니다.
  onPress: PropTypes.func.isRequired
};

/**
 * 버튼 이미지를 얻어온다.
 */
const getButtonSource = name => {
  switch (name) {
    case 'talk':
      return buttonTalk;
    case 'setting':
      return buttonSetting;
    case 'share':
      return buttonDocshare;
    case 'switch':
      return buttonToggleScreen;
    case 'reverse':
      return buttonReverseVideo;
    case 'pen':
      return buttonPen;
    case 'zoomIn':
      return buttonZoomIn;
    case 'zoomOut':
      return buttonZoomOut;
    case 'docShare':
      return buttonDocShare;
    case 'buttonClose':
      return buttonClose;
    case 'btnArrowUp':
      return btnArrowUp;
    case 'btnArrowDown':
      return btnArrowDown;
    default:
      return null;
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
  bottonTouch: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonImage: {
    width: 30,
    height: 30
  }
});

SettingButtonPresenter.defaultProps = {
  areaWidth: 30,
  areaHeight: 30,
  width: 30,
  height: 30
};

export default SettingButtonPresenter;
