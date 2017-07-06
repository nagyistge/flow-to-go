import { connect } from 'react-redux';
import { AppState } from '../../types';
import View from '../components/MainView';

const mapStateToProps = (state: AppState) => ({
  src: state.mainViewSrc
});

const mapDispatchToProps = (dispatch: {}) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
