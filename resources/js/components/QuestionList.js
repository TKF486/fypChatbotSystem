import React, { Component } from "react";
import ReactDOM from "react-dom";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import NavBar from "./NavBar";

export default class QuestionList extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
        };
    }
    loadQuestion() {
        axios.get("http://127.0.0.1:8000/api/questions").then((response) => {
            this.setState({
                questions: response.data,
            });
        });
    }

    componentWillMount() {
        this.loadQuestion();
    }

    render() {
        let questions = this.state.questions.map((question) => {
            return (
                <Accordion.Item eventKey={question.id}>
                    <Accordion.Header>
                        {question.trainingPhrase1}
                    </Accordion.Header>
                    <Accordion.Body>{question.response}</Accordion.Body>
                </Accordion.Item>
            );
        });

        return (
            <div className="container">
                {/* <NavBar /> */}
                <h1>FAQ LIST</h1>
                <Accordion defaultActiveKey="0">{questions}</Accordion>
            </div>
        );
    }
}

if (document.getElementById("questionList")) {
    ReactDOM.render(<QuestionList />, document.getElementById("questionList"));
}
