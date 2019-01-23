/**
 * ConferenceScreenPresenter
 * 화상대화 화면 프레젠터
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableHighlight
} from "react-native";
import { RTCView } from "react-native-webrtc";

/**
 * ConferenceScreenPresenter
 */
const ConferenceScreenPresenter = props => {
  console.log(props);
  if (
    props.participants[0] &&
    props.participants[0].tracks &&
    props.participants[0].tracks.length > 0
  ) {
    const stream = props.participants[0].tracks[1].getOriginalStream();
    console.log(stream);
    return (
      <View style={styles.container}>
        {props.participants.map(participant => (
          <View
            key={participant.id}
            style={styles.box}
            onPress={() => console.log("111")}
          >
            <TouchableHighlight
              style={{ flex: 1 }}
              onPress={() => console.log("333")}
            >
              <RTCView
                onPress={() => console.log("2222")}
                style={{ backgroundColor: "yellow", flex: 1 }}
                mirror={true}
                objectFit={"cover"}
                streamURL={stream.toURL()}
              />
            </TouchableHighlight>
          </View>
        ))}
        <Button
          style={styles.button}
          title="Go Back"
          onPress={() => props.navigation.goBack()}
        />
      </View>
    );
  } else {
    return <View style={styles.container} />;
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column"
  },
  box: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "blue"
  },
  button: {
    flex: 1
  }
});

export default ConferenceScreenPresenter;
