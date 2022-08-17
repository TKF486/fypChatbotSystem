import React, { Component } from "react";
// import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import { Container, Row, Col } from "reactstrap";

import NavBar from "./NavBar";
import PieChart from "./PieChart";

export default class Dashboard extends Component {
    render() {
        return (
            <div className="container">
                <NavBar />
                <Row xs="2">
                    <Col className="bg-light border">
                        <h1>FAQ LIST</h1>
                        <PieChart />
                    </Col>
                    <Col className="bg-light border">Column</Col>
                    <Col className="bg-light border">Column</Col>
                    <Col className="bg-light border">Column</Col>
                </Row>
            </div>
        );
    }
}

if (document.getElementById("root")) {
    ReactDOM.render(<Dashboard />, document.getElementById("root"));
}
