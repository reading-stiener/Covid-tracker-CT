import React, {Component} from 'react';
import * as d3 from 'd3';

class PieChart extends Component {
    componentDidMount() {
        this.drawChart();
    }
    drawChart() {
        const data = this.props.data;
        const h =  this.props.height;
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
            .attr("y", (d, i) => h - 10 * d)
            .attr("width", 25)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");
    }

    render() {
        return <div id={"#" + this.props.id}> </div>
    }
}
export default PieChart; 