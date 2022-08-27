import React, { Component } from "react";
// import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import { Row, Col, Table } from "reactstrap";
import axios from "axios";

import NavBar from "./NavBar";
import PieChart from "./PieChart";

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            sessions: 0,
        };
    }

    loadQuestion() {
        axios.get("http://127.0.0.1:8000/api/questionFreq").then((response) => {
            this.setState({
                questions: response.data,
            });
        });
    }

    getSessionCount() {
        axios.get("http://127.0.0.1:8000/api/sessions").then((response) => {
            this.setState({
                sessions: response.data,
            });
        });
    }

    componentWillMount() {
        this.loadQuestion();
        this.getSessionCount();
    }

    render() {
        let questions = this.state.questions.map((question) => {
            return (
                <tr key={question.id}>
                    <td>{question.intentName}</td>
                    <td>{question.noOfInteractions}</td>
                </tr>
            );
        });

        let sessions = this.state.sessions;

        return (
            <div className="container">
                <NavBar />
                <Row xs="2">
                    <Col className="bg-light border">
                        <h1>Category Analysis</h1>
                        <PieChart />
                    </Col>
                    <Col className="bg-light border">
                        <h1>Frequently Ask Question</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th>intentName</th>
                                    <th>Total Interaction</th>
                                </tr>
                            </thead>
                            <tbody>{questions}</tbody>
                        </Table>
                    </Col>
                    <Col className="bg-light border">
                        <h1>Total User</h1>
                        <h3>{sessions}</h3>
                    </Col>
                    <Col className="bg-light border"></Col>
                </Row>
            </div>
        );
    }
}

if (document.getElementById("root")) {
    ReactDOM.render(<Dashboard />, document.getElementById("root"));
}
