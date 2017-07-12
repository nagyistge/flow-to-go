import { connect } from 'react-redux';
import { AppState } from '../../types';
import View from '../components/TrayMenu';
import { join } from 'path';
import { showAdministration, showDashboard } from '../../actions';
import { remote } from 'electron';

const window = remote.getCurrentWindow();

const mapStateToProps = (state: AppState) => ({
  icon: join(__dirname, 'icons', 'cog.png')
});

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: any) => ({
  showAdministration: () => dispatch(showAdministration()),
  showDashboard: () => dispatch(showDashboard()),
  toggleWindow: () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
      window.focus();
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
