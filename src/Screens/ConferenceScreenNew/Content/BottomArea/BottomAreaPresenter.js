import React from "react";
import { View } from "react-native";
import CotrolBox from "./CotrolBox";
import { ConferenceModes } from "../../../../utils/Constants";

/**
 * BottomAreaPresenter
 */
const BottomAreaPresenter = props =>
  props.conferenceMode === ConferenceModes.CONTROL ? (
    <CotrolBox onClose={props.onClose} />
  ) : (
    <View />
  );

export default BottomAreaPresenter;
