import FileListContainer from './FileListContainer';
import { connect } from 'react-redux';
import { actionCreators as mainUserActions } from '../../../../../redux/modules/mainUser';

const mapDispatchToProps = dispatch => {
  return {
    setDocumentListMode: value => {
      return dispatch(mainUserActions.setDocumentListMode(value));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(FileListContainer);
