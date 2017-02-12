import * as React from 'react';
import Drawer from 'material-ui/Drawer';
import * as ipc from '../helpers/ipc';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';

export default class Menu extends React.Component<{ menuOpen: boolean, menuItems: MenuItem[] }, {}> {

  constructor(props: { menuOpen: boolean, menuItems: MenuItem[] }) {
    super(props);
  }

  render() {
    return <Drawer
      docked={false}
      width={64}
      open={this.props.menuOpen}
      onRequestChange={menuOpen => ipc.mergeState({ menuOpen })}
    >
      {
        this.props.menuItems.map(item => {
          const button = <IconButton
            key={item.id}
            style={{ width: '100%', padding: 16 }}
            onTouchTap={() => ipc.publishMessage(item.id, "onTouchTap")}
            iconClassName={item.icon} />;

          return (item.badge === undefined)
            ? button
            : <Badge
              key={item.id}
              style={{ width: 64, height: 64, padding: 0 }}
              badgeContent={item.badge}
              badgeStyle={{ fontSize: 10, top: 4, right: 4, width: 16, height: 16 }}
              primary={true}
            >
              {button}
            </Badge>;
        })
      }
    </Drawer>;
  }
}