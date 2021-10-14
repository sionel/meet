import CustomCheckBoxPresenter from './CustomCheckBoxPresenter';
import React, { useState } from 'react';


const CustomCheckBoxContainer = (props: any) => {
  const [check, setCheck] = useState(false);
  const {text, color} = props;
  const onCheck = () => setCheck(!check);
  
  return <CustomCheckBoxPresenter {...{ check, onCheck, text, color }} />;
};

export default CustomCheckBoxContainer;
