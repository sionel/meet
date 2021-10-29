import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ParticipantBox from './ParticipantBox';

/**
 * ContentPresenter
 */
const SubVideoBoxPresenter = props => {
  // debugger
  return (
    <ScrollView
      horizontal={props.orientation1 === 'vertical'}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={Object.assign(
        {},
        styles.scrollView,
        props.list.length === 0 ? { margin: 0, padding: 0 } : {}
      )}
      onMomentumScrollEnd={props.moveScroll}
      onScrollEndDrag={props.moveScroll}
      scrollEventThrottle={0} // ios전용 이벤트를 얼마나 발생할지에 대한 빈도 0-16 16하면 디게많이 발생
    >
      {props.user && props.mainUserId !== props.user.id ? (
        <ParticipantBox
          key={props.user.id + 1}
          user={props.user}
          videoTrack={props.user.videoTrack}
          isSelect={props.mainUserId === props.user.id}
        />
      ) : null}
      {props.list.map(
        (participant, index) =>
          props.mainUserId !== participant.id && (
            <ParticipantBox
              number={index}
              key={participant.id}
              user={participant}
              isSelect={props.mainUserId === participant.id}
            />
          )
      )}
    </ScrollView>
  );
};

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
