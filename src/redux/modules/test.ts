import { useStore } from 'react-redux';
import { AnyAction } from 'redux';

const TEST = 'test.TEST';

export interface State {
  testFlag: boolean;
}

const initialState: State = {
  testFlag: false
};

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case TEST:
      debugger
      return _test(state);
    default:
      return state;
  }
};

const test = () => {
  debugger
  return {
    type: TEST
  };
};

const _test = (state: State) => {
  debugger
  return {
    ...state,
    testFlag: !state.testFlag
  };
};

export const actionCreators = {
  test
};
