import React from "react";
import CotrolBox from "./CotrolBox";
import SubVideoBox from "./SubVideoBox";
import { ConferenceModes } from "../../../../utils/Constants";

/**
 * BottomAreaBoxPresenter
 */
const BottomAreaPresenter = props =>
  props.conferenceMode === ConferenceModes.CONTROL ? (
    <CotrolBox onClose={props.onClose} />
  ) : (
    <SubVideoBox onClose={props.onClose} />
  );
export default BottomAreaPresenter;
