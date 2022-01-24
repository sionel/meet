import { AnyAction } from 'redux';
import { UserApi } from '@services/index';

const SET = 'deployed.SET';
const RESET = 'deployed.RESET';

//#region Action Creators

export interface state {
  deployedServices: string[];
}

const initialState: state = {
  deployedServices: ['wehago']
};

const reducer: (state: state, action: AnyAction) => state = (
  state = initialState,
  action: AnyAction
) => {
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

const setDeployedServices = (deployedServices: string[]) => {
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
