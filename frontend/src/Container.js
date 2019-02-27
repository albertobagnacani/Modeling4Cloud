import React from 'react';
import MyDrawer from './MyDrawer';
import MyAppBar from './MyAppBar';
import MyCard from './MyCard';

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {drawerOpened: false};
    }

    handleToggle = () => this.setState({drawerOpened: !this.state.drawerOpened});

    handleClose = () => this.setState({drawerOpened: false});

    render() {
        // TODO fix onRequestChange
        return (
            <div>
                <MyAppBar
                    title="Modeling4Cloud"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onLeftIconButtonClick={this.handleToggle}
                />
                <MyDrawer
                    docked={false}
                    width={200}
                    open={this.state.drawerOpened}
                    onRequestChange={(drawerOpened) => this.setState({drawerOpened})}
                    onMenuItemClick={this.handleClose}
                >
                </MyDrawer>

                <MyCard/>
            </div>
        );
    }
}