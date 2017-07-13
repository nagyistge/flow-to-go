import { connect } from 'react-redux';
import View from '../components/ApplicationMenu';
import { showAdministration, showDashboard } from '../../actions';

const mapStateToProps = () => ({
});

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: any) => ({
  showAdministration: () => dispatch(showAdministration()),
  showDashboard: () => dispatch(showDashboard())
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
