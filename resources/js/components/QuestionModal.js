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
} from "reactstrap";
import axios from "axios";
import AddQuestionModal from "./NewQuestionModal";

export default class QuestionModal extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            updateQuestionData: { id: "", question: "", answer: "" },
            updateQuestionModal: false,
        };
    }
    loadQuestion() {
        axios.get("http://127.0.0.1:8000/api/questions").then((response) => {
            this.setState({
                questions: response.data,
            });
        });
    }

    callUpdateQuestion(id, question, answer) {
        this.setState({
            updateQuestionData: { id, question, answer },
            updateQuestionModal: !this.state.updateQuestionModal,
        });
    }
    updateQuestion() {
        let { id, question, answer } = this.state.updateQuestionData;
        axios
            .put(
                "http://127.0.0.1:8000/api/questionUpdate/" +
                    this.state.updateQuestionData.id,
                { question, answer }
            )
            .then((response) => {
                this.loadQuestion();
                this.setState({
                    updateQuestionModal: false,
                    updateQuestionData: {
                        id: "",
                        question: "",
                        answer: "",
                    },
                });
            });
    }
    deleteQuestion(id) {
        axios
            .delete("http://127.0.0.1:8000/api/questionDelete/" + id)
            .then((response) => {
                this.loadQuestion();
            });
    }
    componentWillMount() {
        this.loadQuestion();
    }

    toggleUpdateQuestionModal() {
        this.setState({
            updateQuestionModal: !this.state.updateQuestionModal,
        });
    }
    render() {
        let questions = this.state.questions.map((question) => {
            return (
                <tr key={question.id}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td>
                        <Button
                            color="success"
                            size="sm"
                            outline
                            onClick={this.callUpdateQuestion.bind(
                                this,
                                question.id,
                                question.question,
                                question.answer
                            )}
                        >
                            Edit
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            outline
                            onClick={this.deleteQuestion.bind(
                                this,
                                question.id
                            )}
                        >
                            Delete
                        </Button>
                    </td>
                </tr>
            );
        });
        return (
            <div className="container">
                <AddQuestionModal />
                <Modal
                    isOpen={this.state.updateQuestionModal}
                    toggle={this.toggleUpdateQuestionModal.bind(this)}
                >
                    <ModalHeader
                        toggle={this.toggleUpdateQuestionModal.bind(this)}
                    >
                        {" "}
                        Update New Question
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="question">Question</Label>
                            <Input
                                id="question"
                                value={this.state.updateQuestionData.question}
                                onChange={(e) => {
                                    let { updateQuestionData } = this.state;
                                    updateQuestionData.question =
                                        e.target.value;
                                    this.setState({ updateQuestionData });
                                }}
                            ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="content">Answer</Label>
                            <Input
                                id="answer"
                                value={this.state.updateQuestionData.answer}
                                onChange={(e) => {
                                    let { updateQuestionData } = this.state;
                                    updateQuestionData.answer = e.target.value;
                                    this.setState({ updateQuestionData });
                                }}
                            ></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={this.updateQuestion.bind(this)}
                        >
                            Update Question{" "}
                        </Button>{" "}
                        <Button
                            color="secondary"
                            onClick={this.toggleUpdateQuestionModal.bind(this)}
                        >
                            {" "}
                            Cancel{" "}
                        </Button>
                    </ModalFooter>
                </Modal>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Question</th>
                            <th>Answer</th>
                        </tr>
                    </thead>
                    <tbody>{questions}</tbody>
                </Table>
            </div>
        );
    }
}

if (document.getElementById("questionModal")) {
    ReactDOM.render(
        <QuestionModal />,
        document.getElementById("questionModal")
    );
}
