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

export default class QuestionModal extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            newQuestionModal: false,
            newQuestionData: { id: "", question: "", answer: "" },
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
                    <td>{question.id}</td>
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
                <div className="sidebar">
                    <p className="sidebar_welcome">Welcome Back xx</p>
                    <Nav vertical>
                        <NavItem>
                            <NavLink href="#">Dashboard</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Database</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Logout</NavLink>
                        </NavItem>
                        {/* <NavItem>
                            <NavLink disabled href="#">
                                Disabled Link
                            </NavLink>
                        </NavItem> */}
                    </Nav>
                </div>

                <div className="main">
                    <h1>Database</h1>
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
                                        newQuestionData.question =
                                            e.target.value;
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
                                    value={
                                        this.state.updateQuestionData.question
                                    }
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
                                        updateQuestionData.answer =
                                            e.target.value;
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
                                onClick={this.toggleUpdateQuestionModal.bind(
                                    this
                                )}
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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>{questions}</tbody>
                    </Table>
                </div>
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
