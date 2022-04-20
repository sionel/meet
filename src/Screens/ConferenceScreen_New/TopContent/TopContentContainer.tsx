import React from 'react';
import TopContentPresenter from './TopContentPresenter';

import { useSelector } from 'react-redux';

import { TopContentContainerProps } from '@screens/ConferenceScreen_New/types';
import { RootState } from 'src/redux/configureStore';

// import { actionCreators as ConferenceActions } from '@redux/conference';

const TopContentContainer: React.FC<TopContentContainerProps> = ({}) => {
  //#region selector
  const { topDisplayType } = useSelector((state: RootState) => ({
    topDisplayType: state.conference.topDisplayType
  }));
  //#endregion selector

  //TODO: 상단 DisplayType 다루는 함수 어디에 넣어야할지 고려해봐야함.
  //#region dispatch
  // const dispatch = useDispatch();
  // const setTopdisplayType = (displayType: 'FUNCTION' | 'NAME') =>
  //   dispatch(ConferenceActions.setTopDisplayType(displayType));
  ////#endregion dispatch

  const _handlePressUserList = () => {};
  const _handlePressChatting = () => {};
  const _handlePressCamaraReverse = () => {};
  const _handlePressDisplayInvert = () => {};
  const _handlePressMore = () => {};

  return (
    <TopContentPresenter
      onPressUserList={_handlePressUserList}
      onPressChatting={_handlePressChatting}
      onPressCamaraReverse={_handlePressCamaraReverse}
      onPressDisplayInvert={_handlePressDisplayInvert}
      onPressMore={_handlePressMore}
      displayType={topDisplayType}
    />
  );
};

export default TopContentContainer;
