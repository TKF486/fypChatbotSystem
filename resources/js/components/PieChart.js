import React, { Component } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default class PieChart extends Component {
    generateRandomColor = () => {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    constructor() {
        super();
        this.state = {
            data: {
                labels: [],
                datasets: [
                    {
                        label: "No. of Interaction",
                        borderColor: ["rgba(16, 16, 16, 1)"],
                        borderWidth: 1,
                    },
                ],
            },
        };
    }

    componentDidMount() {
        let temp = {
            labels: [],
            datasets: [
                {
                    label: "No. of Interaction",
                    borderColor: ["rgba(16, 16, 16, 1)"],
                    borderWidth: 1,
                },
            ],
        };
        let color = [];

        axios.get("http://127.0.0.1:8000/api/pieData").then((response) => {
            temp.labels = response.data.label;
            temp.datasets[0].data = response.data.data;
            temp.labels.forEach(() => {
                color.push(this.generateRandomColor());
            });
            temp.datasets[0].backgroundColor = color;

            console.log(temp);

            this.setState({ data: temp });
        });
    }

    render() {
        console.log(this.state.data);
        return <Pie data={this.state.data} />;
    }
}
