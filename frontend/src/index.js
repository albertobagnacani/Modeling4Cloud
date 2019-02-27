import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Container from './Container';

const App = () => (
    <MuiThemeProvider>
        <Container />
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);