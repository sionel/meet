import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import { ConferenceScreenContainerProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

const ConferenceScreenContainer: React.FC<
  ConferenceScreenContainerProps
> = props => {
  const [first, setfirst] = useState();

  useEffect(() => {
    return () => {};
  }, []);

  const {} = useSelector((state: RootState) => ({}));

  const dispatch = useDispatch();

  return <ConferenceScreenPresenter />;
};
export default ConferenceScreenContainer;
