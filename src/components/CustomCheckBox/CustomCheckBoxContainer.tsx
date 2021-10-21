import CustomCheckBoxPresenter from './CustomCheckBoxPresenter';
import React, { useState } from 'react';


const CustomCheckBoxContainer = (props: any) => {
  const {text, color, style, onCheck, checked} = props;
  
  return <CustomCheckBoxPresenter {...{ checked, onCheck, text, color, style}} />;
};

export default CustomCheckBoxContainer;
