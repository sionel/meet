import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import ParticipantBox from "./ParticipantBox";

/**
 * ContentPresenter
 */
const SubVideoBoxPresenter = props => (
  <ScrollView
    horizontal={props.orientation === "vertical"}
    style={styles.scrollView}
  >
    {props.user ? (
      <ParticipantBox
        key={props.user.id}
        user={props.user}
        videoTrack={props.user.videoTrack}
        isSelect={props.mainUserId === props.user.id}
      />
    ) : null}
    {props.participants.map(participant => (
      <ParticipantBox
        key={participant.id}
        user={participant}
        isSelect={props.mainUserId === participant.id}
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollView: {
    padding: 10
  }
});

export default SubVideoBoxPresenter;
