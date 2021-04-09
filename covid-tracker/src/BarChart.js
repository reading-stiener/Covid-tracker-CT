import React, {Component} from 'react';
import * as d3 from 'd3';

class BarChart extends Component {
    componentDidMount() {
        this.drawChart();
    }
    drawChart() {
        const data = this.props.data;
        const svg = d3.select('body')
            .append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height)
            .style("margin-left", 100);
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", 0)
            .attr("width", 25)
            .attr("height", (d, i) => d)
            .attr("fill", "green");
    }

    render() {
        return <div id={"#" + this.props.id}> </div>
    }
}
export default BarChart; 