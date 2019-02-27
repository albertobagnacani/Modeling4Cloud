import React from 'react';
import AppBar from 'material-ui/AppBar';

export default class MyAppBar extends React.Component {
    constructor(props){
        super(props);

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(e){
        this.props.onLeftIconButtonClick(e.target.value);
    }

    render() {
        return (
            <div>
                <AppBar
                    title={this.props.title}
                    iconClassNameRight={this.props.iconClassName}
                    onLeftIconButtonClick={this.handleToggle}
                />
            </div>
        );
    }
}