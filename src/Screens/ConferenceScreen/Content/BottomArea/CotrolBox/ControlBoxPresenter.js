import React, { Fragment } from "react";
import ControlButton from "./ControlButton";

/**
 * ContentPresenter
 */
const ControlBoxPresenter = props => (
  <Fragment>
    <ControlButton
      name={"speaker"}
      on={true}
      onPress={() => console.log("press")}
    />
    <ControlButton
      name={"camera"}
      on={!props.local.user.isMuteVideo}
      onPress={props.toggleMuteVideo}
    />
    <ControlButton
      name={"mic"}
      on={true}
      onPress={() => console.log("press")}
    />
    <ControlButton name={"endcall"} on={true} onPress={props.onClose} />
  </Fragment>
);

export default ControlBoxPresenter;
