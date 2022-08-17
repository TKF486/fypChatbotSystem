import React, { Component } from "react";
// import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";

import { PieChart } from "./PieChart";

export default class Dashboard extends Component {
    render() {
        return (
            <div className="container">
                <h1>FAQ LIST</h1>
                <PieChart />
            </div>
        );
    }
}

if (document.getElementById("root")) {
    ReactDOM.render(<Dashboard />, document.getElementById("root"));
}
