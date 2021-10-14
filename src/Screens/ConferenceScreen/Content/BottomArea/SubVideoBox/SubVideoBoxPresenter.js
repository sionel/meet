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
    contentContainerStyle={Object.assign(
      {},
      styles.scrollView,
      props.participants.length === 0 ? { margin: 0, padding: 0 } : {}
    )}
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
    // padding: 10,
    margin: 10,
    flexGrow: 1,
    justifyContent: 'center'
    // zIndex: 15
  }
});

export default SubVideoBoxPresenter;
