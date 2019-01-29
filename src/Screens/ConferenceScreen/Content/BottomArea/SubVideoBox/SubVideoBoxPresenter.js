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
        videoTrack={participant.videoTrack}
        isSelect={props.mainUserId === participant.id}
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 15
  }
});

export default SubVideoBoxPresenter;
