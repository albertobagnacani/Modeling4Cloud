import React from 'react';
import MenuItem from 'material-ui/MenuItem';

export default class MyMenuItem extends React.Component {
    constructor(props){
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(e){
        this.props.onClick(e.target.value)
    }

    render() {
        return (
            <MenuItem onClick={this.handleClose}>{this.props.name}</MenuItem>
        );
    }
}