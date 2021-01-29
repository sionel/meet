import MeetApi from '../../services/api/MeetApi';

const UPDATE_MASTER_LIST = 'master.UPDATE_MASTER_LIST';

const initialState = {
  masterList: [],
  isMasterControl: false, // 제어
  isAudioActive: true, // 마이크 활성화
  isMasterMicControl: false // 마스터가 켜고 껐는지
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MASTER_LIST:
      return updateMasterList(state, action);
    default:
      return state;
  }
}

function checkMasterList(token) {
  if (!token) {
  }
  return async dispatch => {
    const result = await MeetApi.getMasterList(token);
    if (!result) {
    }
    
    const masterList = result.resultData.reduce((a, b) => {
      a.push(b.user);
      return a;
    }, []);
    dispatch({
      type: UPDATE_MASTER_LIST,
      masterList
    });
  };
}

function updateMasterList(state, action) {
  // const result = await MeetApi.getMasterList(action.token);
  // const masterList = result.resultData.reduce((a, b) => {
  //   a.push(b.user);
  //   return a;
  // }, []);
  
  return {
    ...state,
    masterList: action.masterList
  };
}

export const actionCreators = {
  checkMasterList
};

export default reducer;
