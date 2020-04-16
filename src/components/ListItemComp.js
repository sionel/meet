/**
 * ListItemCopm
 * 화상대화 히스토리 항목
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import CustomLottie from './CustomLottie';
import { wehagoMainURL } from '../utils';

function getFirtsChar(str) {
  split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
  if (split[0] === str) {
    return split[0][0];
  } else if (split[0].lenth !== 0) {
    return split[0][0];
  } else {
    return '';
  }
}

/**
 *
 * @param {*} props
 */
const ListItemComp = props => {
  // active가 true일 경우 활성화 색
  const activeColor = props.active ? '#1C90FB' : '#eaeaea';
  const updated = new Date(props.updated);
  let disableStyle = { opacity: 1 };
  let onClickEvent = props.onClick;
  const iconWidth = 40 * (props.iconSize / 100);
  const iconTextWidth = 15 * (props.iconSize / 100);
  let iconText = (
    <Text
      style={{
        ...styles.iconText,
        fontSize: iconTextWidth,
        color: props.active ? '#1C90FB' : '#c1c1c1'
      }}
    >
      {props.children ? props.children : getFirtsChar(props.title)}
    </Text>
  );

  // 퇴사자일경우
  if (props.disable) {
    disableStyle = { opacity: 0.35 };
    onClickEvent = () => alert('통화할 수 없는 사용자입니다.');
    iconText = (
      <Text
        style={{
          ...styles.iconText,
          fontSize: iconTextWidth,
          color: props.active ? '#1C90FB' : '#c1c1c1'
        }}
      >
        퇴사
      </Text>
    );
  }

  let displayUpdated;
  switch (props.descriptionType) {
    case 'date':
      displayUpdated = `${updated.getFullYear()}년 `;
      displayUpdated += `${updated.getMonth() + 1 < 10 ? `0` : ``}${
        updated.getMonth() + 1
      }월 `;
      displayUpdated += `${
        updated.getDate() < 10 ? `0` : ``
      }${updated.getDate()}일`;
      break;

    default:
      displayUpdated = props.updated;
      break;
  }
  // 클릭이벤트

  // render
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        height: iconWidth + 14,
        disableStyle,
        borderBottomWidth: 1,
        // borderBottomWidth: props.underline ? 1 : 0
        ...props.customStyle
      }}
      onPress={onClickEvent}
    >
      {/* 아이콘 */}
      <View style={styles.iconWrapper}>
        <View
          style={{
            ...styles.roomIcon,
            width: iconWidth,
            height: iconWidth,
            borderRadius: iconWidth / 2,
            borderColor: activeColor,
            borderWidth: props.active ? 3 : 0
          }}
        >
          {/* 아이콘 텍스트 */}
          {props.room_profile_url ? (
            <Image
              source={
                props.room_profile_url
                  ? {
                      uri: wehagoMainURL + props.room_profile_url
                    }
                  : require('./../../assets/icons/imgNophoto.png')
              }
              defaultSource={require('./../../assets/icons/imgNophoto.png')}
              style={{ width: 40, height: 40, resizeMode: 'cover' }}
            />
          ) : (
            iconText
          )}
        </View>
      </View>
      {/* 내용 */}
      <View style={{ ...styles.textWrapper, paddingRight: '13%' }}>
        {/* 방제목 */}
        <Text style={{ ...styles.roomName }}>{props.title}</Text>
        {/* 참가자 */}
        {/* <Text style={{ ...styles.participant }}>{displayUpdated}</Text> */}
        {/* 활성화 라이트 */}
        {props.lottie && (
          <View style={{ ...styles.activeLight, backgroundColor: activeColor }}>
            {props.active && (
              <CustomLottie source="broadcast" width={35} height={35} />
            )}
          </View>
        )}
        {props.customLottie && (
          <View
            style={{
              ...styles.activeLight,
              top: 6,
              width: 57,
              height: 28,
              borderRadius: 7,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: activeColor
              borderWidth: 1,
              borderColor: '#c1c1c1'
            }}
          >
            <Text
              style={{
                color: '#717171',
                fontSize: 12,
                fontFamily: 'DOUZONEText30'
              }}
            >
              시작
            </Text>
            {/* <Image
							style={{
								width: '100%',
								height: '100%',
								opacity: 0.73
							}}
							source={require(`../../assets/buttons/playButton.png`)}
						/> */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

ListItemComp.defaultProps = {
  customStyle: {}
};

/**
 * styles
 */
const styles = StyleSheet.create({
  // wrapper
  container: {
    width: '100%',
    height: 47,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 13,
    paddingRight: 13,
    borderColor: 'rgb(235,235,235)'
  },
  // 아이콘 랩
  iconWrapper: {
    // flex: 0.2
    // width: 62
  },
  // 룸아이콘
  roomIcon: {
    // flex: 1,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#eaeaea',
    // borderWidth: 3,
    overflow: 'hidden'
  },
  // 아이콘 텍스트
  iconText: {
    fontSize: 10,
    // fontWeight: 'bold',
    fontFamily: 'DOUZONEText50'
  },
  // 방 제목
  roomName: {
    fontSize: 14,
    // fontWeight: 'bold',
    color: 'rgb(80,80,80)',
    fontFamily: 'DOUZONEText30'
  },
  // 참가자
  participant: {
    fontSize: 13.5,
    // fontWeight: '400',
    fontFamily: 'DOUZONEText30',
    color: '#3f3f3f'
  },

  textWrapper: {
    flex: 1,
    // width: '85%',
    height: '100%',
    paddingLeft: 12,
    borderBottomWidth: 0,
    // borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  activeLight: {
    position: 'absolute',
    width: 12,
    height: 12,
    right: 3,
    top: 13,
    borderRadius: 100
  }
});

ListItemComp.defaultProps = {
  iconSize: 100, // %기준
  disable: false,
  active: false,
  lottie: null,
  underline: true,
  descriptionType: 'date' // text
};

export default ListItemComp;
