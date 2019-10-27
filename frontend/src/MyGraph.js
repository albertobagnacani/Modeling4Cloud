import React from 'react';
import {Doughnut, Pie, HorizontalBar, Line} from 'react-chartjs-2';

const spec = {
    width: 500,
    height: 500,
    options: {
        maintainAspectRatio: false
    },
    legend: {
        display: true
    }
}

export default class MyGraph extends React.Component {
    render() {
        // TODO if no data
        return (
            <div>
                {(this.props.graphType == 'Pie') ? <Pie data={this.props.data} width={spec.width} height={spec.height} options={spec.options} redraw/> : null }
                {(this.props.graphType == 'Doughnut') ? <Doughnut data={this.props.data} width={spec.width} height={spec.height} options={spec.options}  redraw/> : null }
                {(this.props.graphType == 'HorizontalBar') ? <HorizontalBar data={this.props.data} width={spec.width} height={spec.height} options={spec.options} legend={spec.legend} redraw/> : null }
                {(this.props.graphType == 'Line') ? <Line data={this.props.data} width={spec.width} height={spec.height} options={spec.options} legend={spec.legend} redraw/> : null }
            </div>
        );
    }
}