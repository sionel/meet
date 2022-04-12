import { MeetParamList } from '@navigations/RootNavigation';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

type ConferenceScreenNavigationProps = StackNavigationProp<
  MeetParamList,
  'ConferenceView_new'
>;

export interface ConferenceScreenContainerProps
  extends StackScreenProps<MeetParamList, 'ConferenceView_new'> {}
export interface ConferenceScreenPresenterProps {
  handleClose: () => void;
}

export interface TopPopupContainerProps {}
export interface TopPopupPresenterProps {}

export interface TopContentContainerProps {}
export interface TopContentPresenterProps {
  UserListClick: () => void;
  ChattingClick: () => void;
  ReverseCamaraClick: () => void;
  DisplayInvertClick: () => void;
  MoreClick: () => void;
}

export interface MainVideoContainerProps {}
export interface MainVideoPresenterProps {}

export interface SplitVideoContainerProps {}
export interface SplitVideoPresenterProps {}

export interface BottomPopupContainerProps {}
export interface BottomPopupPresenterProps extends MenuListProps {}

export interface BottomContentContainerProps {
  handleCloseConf: () => void;
}
export interface BottomContentPresenterProps {
  ToggleSpeakerClick: () => void;
  ToggleMikeClick: () => void;
  ToggleVideoClick: () => void;
  EndCallClick: () => void;
}

export interface MenuListProps {
  onPressScreenShare: () => void;
  onPressRequestMic: () => void;
  isMaster: Boolean;
}

export interface ChattingProps {}
