import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import ParticipantBox from "./ParticipantBox";

/**
 * ContentPresenter
 */
const SubVideoBoxPresenter = props => (
  <ScrollView horizontal={true} style={styles.scrollView}>
    {props.user ? (
      <ParticipantBox
        user={props.user}
        isSelect={props.mainUserId === props.user.id}
      />
    ) : null}
    {props.user ? (
      <ParticipantBox
        user={props.user}
        isSelect={props.mainUserId === props.user.id}
      />
    ) : null}
    {props.user ? (
      <ParticipantBox
        user={props.user}
        isSelect={props.mainUserId === props.user.id}
      />
    ) : null}
    {props.user ? (
      <ParticipantBox
        user={props.user}
        isSelect={props.mainUserId === props.user.id}
      />
    ) : null}
    {props.user ? (
      <ParticipantBox
        user={props.user}
        isSelect={props.mainUserId === props.user.id}
      />
    ) : null}
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 15
  }
});

export default SubVideoBoxPresenter;
