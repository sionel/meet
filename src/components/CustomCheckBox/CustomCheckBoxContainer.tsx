import CustomCheckBoxPresenter from './CustomCheckBoxPresenter';
import React, { useState } from 'react';


const CustomCheckBoxContainer = () => {
  const [check, setCheck] = useState(false);

  const onCheck = () => setCheck(!check);
  
  return <CustomCheckBoxPresenter {...{ check, onCheck }} />;
};

export default CustomCheckBoxContainer;
