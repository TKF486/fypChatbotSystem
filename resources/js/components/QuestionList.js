import React, { Component } from "react";
import ReactDOM from "react-dom";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";

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
                    <Accordion.Header>{question.question}</Accordion.Header>
                    <Accordion.Body>{question.answer}</Accordion.Body>
                </Accordion.Item>
            );
        });
        return (
            <div className="container">
                <Accordion defaultActiveKey="0">{questions}</Accordion>
            </div>
        );
    }
}

if (document.getElementById("questionList")) {
    ReactDOM.render(<QuestionList />, document.getElementById("questionList"));
}
