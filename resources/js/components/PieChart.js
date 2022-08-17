import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    FormGroup,
    Label,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
import axios from "axios";
import NavBar from "./NavBar";

export default class PieChart extends Component {
    constructor() {
        super();
        this.state = {};
    }

    viewChart() {
        //get the pie chart canvas
        var cData = JSON.parse(`<?php echo $chart_data; ?>`);
        var ctx = $("#pie-chart");

        //pie chart data
        var data = {
            labels: cData.label,
            datasets: [
                {
                    label: "Users Count",
                    data: cData.data,
                    backgroundColor: [
                        "#DEB887",
                        "#A9A9A9",
                        "#DC143C",
                        "#F4A460",
                        "#2E8B57",
                        "#1D7A46",
                        "#CDA776",
                    ],
                    borderColor: [
                        "#CDA776",
                        "#989898",
                        "#CB252B",
                        "#E39371",
                        "#1D7A46",
                        "#F4A460",
                        "#CDA776",
                    ],
                    borderWidth: [1, 1, 1, 1, 1, 1, 1],
                },
            ],
        };

        //options
        var options = {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "CATEGORY ANALYSIS",
                fontSize: 18,
                fontColor: "#111",
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16,
                },
            },
        };

        //create Pie Chart class object
        var chart1 = new Chart(ctx, {
            type: "pie",
            data: data,
            options: options,
        });
    }

    componentWillMount() {
        this.viewChart();
    }

    render() {
        return (
            <div className="container">
                <NavBar />
                <div className="main">
                    <h1>Dashboard</h1>
                    <div class="pie-chart-container">
                        <canvas
                            id="pie-chart"
                            style="width:100%;max-width:400px"
                        ></canvas>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById("PieChart")) {
    ReactDOM.render(<PieChart />, document.getElementById("PieChart"));
}
