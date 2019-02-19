/**
 * ListItemCopm
 * 화상대화 히스토리 항목
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import CustomLottie from "./CustomLottie";

const ListItemComp = props => {
  // active가 true일 경우 활성화 색
  const activeColor = props.active ? "#1C90FB" : "#eaeaea";
  const updated = new Date(props.updated);
  let disableStyle = { opacity: 1 };
  let onClickEvent = props.onClick;
  let iconText = (
    <Text
      style={{
        ...styles.iconText,
        color: props.active ? "#1C90FB" : "#c1c1c1"
      }}
    >
      {typeof props.title[0] === "string" ? "a" : props.title[0]}
    </Text>
  );

  // 퇴사자일경우
  if (props.disable) {
    disableStyle = { opacity: 0.35 };
    onClickEvent = () => alert("통화할 수 없는 사용자입니다.");
    iconText = (
      <Text
        style={{
          ...styles.iconText,
          fontSize: 15,
          color: props.active ? "#1C90FB" : "#c1c1c1"
        }}
      >
        퇴사
      </Text>
    );
  }
  // 클릭이벤트
  let displayUpdated = `${updated.getFullYear()}년 `;
  displayUpdated += `${
    updated.getMonth() + 1 < 10 ? `0` : ``
  }${updated.getMonth() + 1}월 `;
  displayUpdated += `${
    updated.getDate() < 10 ? `0` : ``
  }${updated.getDate()}일`;

  // render
  return (
    <TouchableOpacity
      style={[styles.container, disableStyle]}
      onPress={onClickEvent}
    >
      {/* 아이콘 */}
      <View style={styles.iconWrapper}>
        <View style={{ ...styles.roomIcon, borderColor: activeColor }}>
          {/* 아이콘 텍스트 */}
          {iconText}
        </View>
      </View>
      {/* 내용 */}
      <View style={{ ...styles.textFlex }}>
        {/* 방제목 */}
        <Text style={{ ...styles.roomName }}>{props.title}</Text>
        {/* <View style={{ backgroundColor: 'red', width: 10, height: 10 }} /> */}
        {/* 참가자 */}
        {/* <Text style={{ ...styles.participant }}>{props.personnel} 명</Text> */}
        <Text style={{ ...styles.participant }}>updated: {displayUpdated}</Text>
        {/* 활성화 라이트 */}
        <View style={{ ...styles.activeLight, backgroundColor: activeColor }}>
          {props.active && (
            <CustomLottie source="broadcast" width={30} height={30} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  // wrapper
  container: {
    width: "100%",
    height: 57,
    display: "flex",
    flexDirection: "row",
    marginBottom: 12,
    paddingLeft: "3%",
    paddingRight: "3%"
  },
  // 아이콘 랩
  iconWrapper: {
    flex: 0.2
  },
  // 룸아이콘
  roomIcon: {
    flex: 1,
    width: 57,
    height: 57,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#eaeaea",
    borderWidth: 3
  },
  // 아이콘 텍스트
  iconText: {
    fontSize: 22,
    fontWeight: "bold"
  },
  // 방 제목
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3c3c3c"
  },
  // 참가자
  participant: {
    fontSize: 13.5,
    fontWeight: "400",
    color: "#3f3f3f"
  },

  textFlex: {
    flex: 0.8,
    height: "100%",
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  activeLight: {
    position: "absolute",
    width: 12,
    height: 12,
    right: 3,
    top: 20,
    borderRadius: 100
  }
});

ListItemComp.defaultProps = {
  disable: false
};

export default ListItemComp;
