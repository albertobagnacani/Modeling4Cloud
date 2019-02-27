import React from 'react';
import Drawer from 'material-ui/Drawer';
import MyMenuItem from './MyMenuItem';

export default class MyDrawer extends React.Component {
    constructor(props){
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.onMenuItemClick();
    }

    render() {
        return (
            <div>
                <Drawer
                    docked={this.props.docked}
                    width={this.props.width}
                    open={this.props.open}
                    onRequestChange={this.props.onRequestChange} // TODO
                >
                    <MyMenuItem onClick={this.handleClose} name="Homepage"/>
                    <MyMenuItem onClick={this.handleClose} name="Graphs"/>
                    <MyMenuItem onClick={this.handleClose} name="Settings"/>
                </Drawer>
            </div>
        );
    }
}