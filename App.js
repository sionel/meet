import React, { Component } from "react";
import { AppRegistry, View } from "react-native";

import JitsiMeetJS, {
  JitsiConnectionEvents
} from "./jitsi/features/base/lib-jitsi-meet";
// import "./react/features/base/lib-jitsi-meet/native/polyfills-bundler";

console.log(JitsiMeetJS);

class App extends Component {
  render() {
    return <View style={{ flex: 1, backgroundColor: "blue" }} />;
  }
}

AppRegistry.registerComponent("App", () => App);
