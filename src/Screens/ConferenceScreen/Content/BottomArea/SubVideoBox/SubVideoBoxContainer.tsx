import React, { useEffect, useState } from 'react';
import SubVideoBoxPresenter from './SubVideoBoxPresenter';
import { Dimensions } from 'react-native';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/configureStore';
import { getConferenceManager } from '../../../../../utils/ConferenceManager';

import _ from 'underscore';

export default function SubVideoBoxContainer(props) {
  const { user, mainUserId, list, orientation1 } = useSelector(
    (state: RootState) => {
      return {
        user: state.local.user,
        mainUserId: state.mainUser.mainUserId,
        list: state.participants.list,
        orientation1: state.orientation.orientation
      };
    }
  );
  // const moveScroll = event => {
  //   _.debounce(_moveScroll(event), 500);
  // };

  useEffect(() => {
    resolutionImprovement(0);
  }, [list]);

  const moveScroll = event => {
    const { x, y } = event.nativeEvent.contentOffset;
    const position = x > y ? x : y;
    const listInterval = orientation1 === 'vertical' ? 100 : 110;
    const startNumber =
      position > listInterval
        ? Math.floor((position - listInterval) / listInterval)
        : 0;
    resolutionImprovement(startNumber);
  };

  const resolutionImprovement = startNumber => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const length = orientation1 === 'vertical' ? width : height;
    const viewNumber = Math.floor(length / 100) + 2;

    const m = getConferenceManager();
    const selectedSubList = list
      .filter(v => {
        return v.id !== mainUserId;
      })
      .splice(startNumber, viewNumber)
      .map(user => user.id);

    m.setReceiverConstraints(mainUserId, selectedSubList);
  };
  
  return Number(props.callType) === 2 ? null : (
    <SubVideoBoxPresenter
      {...props}
      {...{ user, mainUserId, list, moveScroll, orientation1 }}
    />
  );
}

// import React from 'react';
// import SubVideoBoxPresenter from './SubVideoBoxPresenter';

// class SubVideoBoxContainer extends React.Component {
//   render() {
//     if (Number(this.props.callType) === 2) {
//       return null;
//     } else {
//       return <SubVideoBoxPresenter {...this.props} />;
//     }
//   }
// }

// export default SubVideoBoxContainer;
