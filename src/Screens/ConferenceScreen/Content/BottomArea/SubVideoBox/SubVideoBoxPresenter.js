import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ParticipantBox from './ParticipantBox';

/**
 * ContentPresenter
 */
const SubVideoBoxPresenter = props => (
  <ScrollView
    horizontal={props.orientation === 'vertical'}
    showsHorizontalScrollIndicator={false}
    style={styles.scrollView}
  >
    {props.user && props.mainUserId !== props.user.id ? (
      <ParticipantBox
        key={props.user.id}
        user={props.user}
        videoTrack={props.user.videoTrack}
        isSelect={props.mainUserId === props.user.id}
      />
    ) : null}
    {props.participants.map(
      participant =>
        props.mainUserId !== participant.id && (
          <ParticipantBox
            key={participant.id}
            user={participant}
            isSelect={props.mainUserId === participant.id}
          />
        )
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
    margin: 10,
    zIndex: 15
  }
});

export default SubVideoBoxPresenter;
