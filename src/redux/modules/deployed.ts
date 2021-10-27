import { UserApi } from '../../services';

const SET = 'deployed.SET';
const RESET = 'deployed.RESET';

//#region Action Creators

export interface state {
  deployedServices: any[];
}

const initialState: state = {
  deployedServices: ['wehago']
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET:
      return {
        deployedServices: [...action.payload]
      };
    case RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

//#endregion Reducer

const setDeployedServices = deployedServices => {
  return {
    type: SET,
    payload: deployedServices
  };
};
const resetDeployedServices = () => {
  return {
    type: RESET
  };
};
//#region Export

const actionCreators = {
  setDeployedServices,
  resetDeployedServices
};

export { actionCreators };
export default reducer;

//#endregion Export