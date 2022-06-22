import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    FormGroup,
    Label,
} from "reactstrap";
import axios from "axios";

export default class NewQuestionModal extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            newQuestionModal: false,
            newQuestionData: { id: "", question: "", answer: "" },
        };
    }

    loadQuestion() {
        axios.get("http://127.0.0.1:8000/api/questions").then((response) => {
            this.setState({
                questions: response.data,
            });
        });
    }

    addQuestion() {
        axios
            .post(
                "http://127.0.0.1:8000/api/question",
                this.state.newQuestionData
            )
            .then((response) => {
                // console.log("Load part...");
                let { questions } = this.state;
                this.loadQuestion();
                this.setState({
                    questions,
                    newQuestionModal: false,
                    newQuestionData: { id: "", question: "", answer: "" },
                });
            });
    }

    togglenewQuestionModal() {
        this.setState({
            newQuestionModal: !this.state.newQuestionModal,
        });
    }

    componentWillMount() {
        this.loadQuestion();
    }

    render() {
        return (
            <div>
                <Button
                    color="primary"
                    onClick={this.togglenewQuestionModal.bind(this)}
                >
                    Add Question
                </Button>
                <Modal
                    isOpen={this.state.newQuestionModal}
                    toggle={this.togglenewQuestionModal.bind(this)}
                >
                    <ModalHeader
                        toggle={this.togglenewQuestionModal.bind(this)}
                    >
                        {" "}
                        Add New Question
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="question">Question</Label>
                            <Input
                                id="question"
                                value={this.state.newQuestionData.title}
                                onChange={(e) => {
                                    let { newQuestionData } = this.state;
                                    newQuestionData.question = e.target.value;
                                    this.setState({ newQuestionData });
                                }}
                            ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="answer">Answer</Label>
                            <Input
                                id="answer"
                                value={this.state.newQuestionData.answer}
                                onChange={(e) => {
                                    let { newQuestionData } = this.state;
                                    newQuestionData.answer = e.target.value;
                                    this.setState({ newQuestionData });
                                }}
                            ></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={this.addQuestion.bind(this)}
                        >
                            Add Question{" "}
                        </Button>{" "}
                        <Button
                            color="secondary"
                            onClick={this.togglenewQuestionModal.bind(this)}
                        >
                            {" "}
                            Cancel{" "}
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

if (document.getElementById("newQuestionModal")) {
    ReactDOM.render(
        <NewQuestionModal />,
        document.getElementById("newQuestionModal")
    );
}
