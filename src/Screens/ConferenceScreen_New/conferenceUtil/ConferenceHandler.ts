import { actionCreators as testAction } from '@redux/test';

export const ConferenceHandler = (dispatch: any) => ({
  test: () => {
    dispatch(testAction.test());
  }
});

// ConferenceDispatch;

export type ConferenceHandler = ReturnType<typeof ConferenceHandler>;
