import React from 'react';
import {Card, Tabs, Tab, FontIcon, DatePicker, Toggle, GridList, GridTile, SelectField, MenuItem, RaisedButton, TextField, RadioButtonGroup, RadioButton} from 'material-ui/';
import MyGraph from './MyGraph';
import moment from "moment/moment";

var styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        margin: '0 auto'
    },
    gridList: {
        width: 200,
        height: 500,
        overflowY: 'auto',
    },
};

const pieDoughnutBarHelper = {
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [
            '#d50000',
            '#2962ff',
            '#00c853',
            '#ffab00'
        ],
        hoverBackgroundColor: [
            '#ff5252',
            '#448aff',
            '#69f0ae',
            '#ffd740'
        ]
    }]
}

const horizontalBarHelper = {
    labels: [],
    datasets: [
        {
            label: 'Comparison between providers based on average of all pings',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
        }
    ]
}

const lineHelper = {
    labels: [],
    datasets: [{
        label: 'Average ping for every day for selected provider and year',
        data: [],
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10
    }]
}

export default class MyCard extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            queryNumber: 1,
            start: null,
            end: null,
            year: null,
            provider: null,
            sameRegion: true,
            buttonDisabled: true,
            buttonClicked: false,
            graphType: null,
            graphData: null
        }
    }

    handleYearChange = (event, value) => {
        this.setState({year: parseInt(value)}, this.check);
    }

    handleProviderChange = (event, value) => {
        this.setState({provider: value}, this.check);
    }

    handleQueryNumberChange = (event, index, value) => {
        this.setState({queryNumber: value, buttonDisabled: true});
    }

    check(){
        if(this.state.queryNumber == 1) {
            if (this.state.start && this.state.end) {
                this.setState({buttonDisabled: false})
            }
        }else{
            if (this.state.provider && this.state.year) { // TODO handle input
                this.setState({buttonDisabled: false})
            }
        }
    }

    handleStartChange = (event, date) => {
        this.setState({
            start: date,
        }, this.check);
    };

    handleEndChange = (event, date) => {
        this.setState({
            end: date,
        }, this.check);
    };

    handleSameRegionChange = (event, isInputChecked) =>{
        this.setState({sameRegion: isInputChecked});
    }

    handleRadioButton = (event, value) =>{
        this.setState({graphType: value});
    }

    handleClick = (event) =>{
        this.callApi()
            .then(res => {
                var graphType = (this.state.queryNumber == 1) ? 'HorizontalBar' : 'Line';
                var graphDataModified = (graphType == 'HorizontalBar') ? horizontalBarHelper: lineHelper;
                let datasetsModified = graphDataModified.datasets;
                let labelsModified = graphDataModified.labels;

                datasetsModified[0].data.length = 0;
                labelsModified.length = 0;

                for(let resource of res){
                    datasetsModified[0].data.push(resource.avg)
                    labelsModified.push(resource._id)
                }
                this.setState({graphData: graphDataModified, graphType: graphType, buttonClicked: true, redraw: true})

            })
            .then(() =>{
                this.resetForm()
            })
            .catch(err => console.log(err))
    }

    // TODO insert date instead of numbers in x axis

    async callApi(){ // TODO
        // TODO ip hard-coded
        var query = (this.state.queryNumber == 1)
            ? process.env.Q1+moment(this.state.start).format('YYYY-MM-DD')+'&end='+moment(this.state.end).format('YYYY-MM-DD')+'&sameRegion='+((this.state.sameRegion === true) ? 0 : 1)
            : process.env.Q2+this.state.year+'&sameRegion='+((this.state.sameRegion === true) ? 0 : 1)+'&provider='+this.state.provider;
        const response = await fetch(query);
        const body = await response.json();

        return body;
    }

    resetForm = () =>{
        //this.setState({start: null, end: null, buttonDisabled: true})
    }

    renderFirst(){
        switch(this.state.queryNumber){
            case 1:
                return(
                    <DatePicker hintText="Select start date" value={this.state.start} onChange={this.handleStartChange}/>
                )
            case 2:
                return(
                    <TextField hintText="Select year (es: 2018)" onChange={this.handleYearChange}/>
                    //<TextField hintText="Es: 2018" floatingLabelText="Insert year"/>
                    //<DatePicker hintText="Select start year" value={this.state.start} onChange={this.handleStartChange}/>
                )
            case 3:
                return(
                    <DatePicker hintText="Select start month" value={this.state.start} onChange={this.handleStartChange}/>
                )
            case 4:
                return(
                    <DatePicker hintText="Select start day" value={this.state.start} onChange={this.handleStartChange}/>
                )
        }

    }

    renderSecond(){
        switch(this.state.queryNumber){
            case 1:
                return(
                    <DatePicker hintText="Select end date" value={this.state.end} onChange={this.handleEndChange}/>
                )
            case 2:
                return(
                    <TextField hintText="Select provider (es: 'AWS')" onChange={this.handleProviderChange}/>
                    //<TextField hintText="Es: 'AWS'" floatingLabelText="Insert provider"/>
                    //<DatePicker hintText="Select end year" value={this.state.end} onChange={this.handleEndChange}/>
                )
            case 3:
                return(
                    <DatePicker hintText="Select end month" value={this.state.end} onChange={this.handleEndChange}/>
                )
            case 4:
                return(
                    <DatePicker hintText="Select end day" value={this.state.end} onChange={this.handleEndChange}/>
                )
        }
    }

    render() {
        return (
            <Card>
                <Tabs>
                    <Tab icon={<FontIcon className="material-icons" >date_range</FontIcon>} label="Pick">
                        <div style={styles.root}>
                            <GridList
                                cols={1}
                                cellHeight={100}
                                padding={1}
                                style={styles.gridList}
                            >
                                <GridTile>
                                    <SelectField
                                        floatingLabelText="Query"
                                        value={this.state.queryNumber}
                                        onChange={this.handleQueryNumberChange}
                                    >
                                        <MenuItem value={1} primaryText="Comparison" />
                                        <MenuItem value={2} primaryText="Year" />
                                        <MenuItem value={3} primaryText="Month" />
                                        <MenuItem value={4} primaryText="Day" />
                                    </SelectField>
                                </GridTile>
                                <GridTile>
                                    {this.renderFirst()}
                                </GridTile>
                                <GridTile>
                                    {this.renderSecond()}
                                </GridTile>
                                <GridTile>
                                    <Toggle label="Same Region" defaultToggled={true} onToggle={this.handleSameRegionChange}/>
                                </GridTile>
                                {/*<GridTile>
                                    <RadioButtonGroup name="graphType" defaultSelected="Pie" style={{display: 'inline'}} onChange={this.handleRadioButton}>
                                        <RadioButton value="Pie" label="Pie"/>
                                        <RadioButton value="Doughnut" label="Doughnut"/>
                                        <RadioButton value="HorizontalBar" label="HorizontalBar"/>
                                        <RadioButton value="Line" label="Line"/>
                                    </RadioButtonGroup>
                                </GridTile>*/}
                                <GridTile>
                                    <RaisedButton label="Send" secondary={true} disabled={this.state.buttonDisabled} onClick={this.handleClick} style={{marginLeft: '27%'}}/>
                                </GridTile>
                            </GridList>
                        </div>
                    </Tab>
                    <Tab icon={<FontIcon className="material-icons" >pie_chart</FontIcon>} label="Graph">
                        <div>
                            { this.state.buttonClicked ? <MyGraph data={this.state.graphData} graphType={this.state.graphType}/> : null }
                        </div>
                    </Tab>
                </Tabs>
            </Card>
        );
    }
}