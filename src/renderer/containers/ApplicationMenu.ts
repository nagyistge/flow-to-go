import { connect } from 'react-redux';
import { AppState } from '../../types';
import View from '../components/ApplicationMenu';
import { showAdministration, showDashboard } from '../../actions'

const mapStateToProps = (state: AppState) => ({
});

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: any) => ({
  showAdministration: () => dispatch(showAdministration()),
  showDashboard: () => dispatch(showDashboard())
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
