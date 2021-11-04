import React from 'react';
import SubVideoBoxPresenter from './SubVideoBoxPresenter';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/configureStore';

export default function SubVideoBoxContainer(props) {
  const { user, mainUserId, list } = useSelector((state: RootState) => {
    return {
      user: state.local.user,
      mainUserId: state.mainUser.mainUserId,
      list: state.participants.list
    };
  });

  const moveScroll = event => {
    console.log(event.nativeEvent.contentOffset);
  };

  return Number(props.callType) === 2 ? null : (
    <SubVideoBoxPresenter
      {...props}
      {...{ user, mainUserId, list, moveScroll }}
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
