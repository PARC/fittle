/**
 * Created by lnelson on 5/9/2017.
 */

/*
 * Component to show a Goal Met Chart
 */

import React, {Component} from 'react';
import ReactDom from 'react-dom';


export var GoalMetChart = React.createClass({

    updateChart: function (props) {
        var data = props.data;

        var max = _.max(_.pluck(data, "qty"));
        var yScale = d3.scale.linear()
            .domain([0, max])
            .range([0, props.height - 60]);

        var xScale = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeRoundBands([0, props.width], 0.05);

        var svg = d3.select("svg");

        var bars = svg.selectAll("rect").data(data);
        bars.enter()
            .append("rect")
            .attr("fill", function (barSpec) {
                if (barSpec.qty && barSpec.qty > 1) {
                    return "green";
                } else {
                    return "orange";
                }
            });

        bars.transition()
            .duration(1000)
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", function (d, i) {
                return props.height - yScale(d.qty) - 25;
            })
            .attr("width", xScale.rangeBand())
            .attr("height", function (d, i) {
                return yScale(d.qty)
            });

        bars.exit()
            .remove();

        var qtyLabel = svg.selectAll(".qtyLabel").data(data);
        qtyLabel.enter()
            .append("text")
            .attr("class", "qtyLabel")
            .style("font-weight", "bold")
            .attr("text-anchor", "middle")

        qtyLabel.transition()
            .duration(1000)
            .attr("x", function (d, i) {
                return xScale(i) + xScale.rangeBand() / 2;
            })
            .attr("y", function (d, i) {
                return props.height - yScale(d.qty) - 25
            })
            .text(function (d, i) {
                return d.qty == 2 ? '✓' : (d.qty == 1 ? '×' : "" );
            });

        var xLabel = svg.selectAll(".xLabel").data(data);
        xLabel.enter()
            .append("text")
            .attr("class", "xLabel")

        xLabel.text(function (d, i) {
            return d.xLabel;
        })
            .attr("text-anchor", "middle")
            .attr("x", function (d, i) {
                return xScale(i) + xScale.rangeBand() / 2;
            })
            .attr("y", function (d, i) {
                return props.height - 5;
            });

        var legend = svg.selectAll(".legend")
            .data(["Goal Met True","Goal Met False","No report left blank"])
            .enter().append("g")
            .attr("class", "rect")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", props.width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (barSpec) {
                if (barSpec == "Goal Met True") {
                    return "green";
                } else if (barSpec == "Goal Met False") {
                    return "orange";
                } else {
                    return "white"
                }
            });

        legend.append("text")
            .attr("x", props.width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .text(function(d) { return d; });

    },

    componentDidMount: function () {
        var el = ReactDom.findDOMNode(this); // This is de div we are rendering
        var svg = d3.select(el)
            .append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height);

        this.updateChart(this.props);
    },

    componentWillUpdate: function (nextProps) {
        this.updateChart(nextProps);
    },

    getDefaultProps: function () {
        return {
            width: 640,
            height: 480
        }
    },

    render: function () {
        return (
            <div className="chart"></div>
        );
    }
});

/*************************************************************************
 *
 *  © [2018] PARC Inc., A Xerox Company
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Xerox Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to PARC Inc. and Xerox Corp.,
 * and may be covered by U.S. and Foreign Patents,
 * patents in process, and may be protected by copyright law.
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 *
 **************************************************************************/
