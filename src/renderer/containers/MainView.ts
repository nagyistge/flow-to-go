import { connect } from 'react-redux';
import { AppState } from '../../types';
import View from '../components/MainView';
import { updateOnlineState } from '../../actions';

const mapStateToProps = (state: AppState) => ({
  src: state.mainViewSrc
});

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: any) => ({
  handleOnline: () => dispatch(updateOnlineState(true)),
  handleOffline: () => dispatch(updateOnlineState(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
