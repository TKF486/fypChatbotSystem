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

export default class QuestionModal extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            categories: [],
            newQuestionModal: false,
            newQuestionData: {
                id: "",
                intentName: "",
                intentID: "",
                category_id: 1,
                noOfInteractions: 0,
                trainingPhrase1: "",
                trainingPhrase2: "",
                trainingPhrase3: "",
                trainingPhrase4: "",
                response: "",
            },
            updateQuestionData: {
                id: "",
                intentName: "",
                intentID: "",
                category_id: "",
                noOfInteractions: "",
                trainingPhrase1: "",
                trainingPhrase2: "",
                trainingPhrase3: "",
                trainingPhrase4: "",
                response: "",
            },
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

    loadCategory() {
        axios.get("http://127.0.0.1:8000/api/categories").then((response) => {
            this.setState({
                categories: response.data,
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
                let { questions } = this.state;
                this.loadQuestion();
                this.setState({
                    questions,
                    newQuestionModal: false,
                    newQuestionData: {
                        id: "",
                        intentName: "",
                        intentID: "",
                        category_id: 1,
                        noOfInteractions: 0,
                        trainingPhrase1: "",
                        trainingPhrase2: "",
                        trainingPhrase3: "",
                        trainingPhrase4: "",
                        response: "",
                    },
                });
            });
    }

    togglenewQuestionModal() {
        this.setState({
            newQuestionModal: !this.state.newQuestionModal,
        });
    }

    callUpdateQuestion(
        id,
        intentName,
        intentID,
        category_id,
        noOfInteractions,
        trainingPhrase1,
        trainingPhrase2,
        trainingPhrase3,
        trainingPhrase4,
        response
    ) {
        this.setState({
            updateQuestionData: {
                id,
                intentName,
                intentID,
                category_id,
                noOfInteractions,
                trainingPhrase1,
                trainingPhrase2,
                trainingPhrase3,
                trainingPhrase4,
                response,
            },
            updateQuestionModal: !this.state.updateQuestionModal,
        });
    }
    updateQuestion() {
        let {
            id,
            intentName,
            intentID,
            category_id,
            noOfInteractions,
            trainingPhrase1,
            trainingPhrase2,
            trainingPhrase3,
            trainingPhrase4,
            response,
        } = this.state.updateQuestionData;
        axios
            .put(
                "http://127.0.0.1:8000/api/questionUpdate/" +
                    this.state.updateQuestionData.id,
                {
                    intentName,
                    intentID,
                    category_id,
                    noOfInteractions,
                    trainingPhrase1,
                    trainingPhrase2,
                    trainingPhrase3,
                    trainingPhrase4,
                    response,
                }
            )
            .then((response) => {
                this.loadQuestion();
                this.setState({
                    updateQuestionModal: false,
                    updateQuestionData: {
                        id: "",
                        intentName: "",
                        intentID: "",
                        category_id: "",
                        noOfInteractions: "",
                        trainingPhrase1: "",
                        trainingPhrase2: "",
                        trainingPhrase3: "",
                        trainingPhrase4: "",
                        response: "",
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
        this.loadCategory();
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
                    <td>{question.intentName}</td>
                    <td>{question.intentID}</td>
                    <td>{question.category_id}</td>
                    <td>{question.noOfInteractions}</td>
                    <td>{question.trainingPhrase1}</td>
                    <td>{question.trainingPhrase2}</td>
                    <td>{question.trainingPhrase3}</td>
                    <td>{question.trainingPhrase4}</td>
                    <td>{question.response}</td>
                    <td>
                        <Button
                            color="success"
                            size="sm"
                            outline
                            onClick={this.callUpdateQuestion.bind(
                                this,
                                question.id,
                                question.intentName,
                                question.intentID,
                                question.category_id,
                                question.noOfInteractions,
                                question.trainingPhrase1,
                                question.trainingPhrase2,
                                question.trainingPhrase3,
                                question.trainingPhrase4,
                                question.response
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

        let categories = this.state.categories.map((category) => {
            return (
                <option key={category.id} value={category.id}>
                    {category.categoryName}
                </option>
            );
        });

        return (
            <div className="container">
                <NavBar />
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
                                <Label for="intentName">intentName</Label>
                                <Input
                                    id="intentName"
                                    value={
                                        this.state.newQuestionData.intentName
                                    }
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.intentName =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            {/* <FormGroup>
                                <Label for="category_id">category_id</Label>
                                <Input
                                    id="category_id"
                                    value={this.state.newQuestionData.category_id}
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.category_id =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                ></Input>
                            </FormGroup> */}

                            <FormGroup>
                                <Label for="category_id">Select</Label>
                                <Input
                                    id="category_id"
                                    name="category_id"
                                    type="select"
                                    value={
                                        this.state.newQuestionData.category_id
                                    }
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.category_id =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                >
                                    {categories}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="trainingPhrase1">
                                    trainingPhrase1
                                </Label>
                                <Input
                                    id="trainingPhrase1"
                                    value={
                                        this.state.newQuestionData
                                            .trainingPhrase1
                                    }
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.trainingPhrase1 =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="trainingPhrase2">
                                    trainingPhrase2
                                </Label>
                                <Input
                                    id="trainingPhrase2"
                                    value={
                                        this.state.newQuestionData
                                            .trainingPhrase2
                                    }
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.trainingPhrase2 =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="trainingPhrase3">
                                    trainingPhrase3
                                </Label>
                                <Input
                                    id="trainingPhrase3"
                                    value={
                                        this.state.newQuestionData
                                            .trainingPhrase3
                                    }
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.trainingPhrase3 =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="trainingPhrase4">
                                    trainingPhrase4
                                </Label>
                                <Input
                                    id="trainingPhrase4"
                                    value={
                                        this.state.newQuestionData
                                            .trainingPhrase4
                                    }
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.trainingPhrase4 =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="response">response</Label>
                                <Input
                                    id="response"
                                    value={this.state.newQuestionData.response}
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.response =
                                            e.target.value;
                                        //**add intentID
                                        newQuestionData.intentID =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            {/* <FormGroup>
                                <Label for="intentID">intentID</Label>
                                <Input
                                    id="intentID"
                                    value={this.state.newQuestionData.intentID}
                                    onChange={(e) => {
                                        let { newQuestionData } = this.state;
                                        newQuestionData.intentID =
                                            e.target.value;
                                        this.setState({ newQuestionData });
                                    }}
                                ></Input>
                            </FormGroup> */}
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
                                <Label for="intentName">intentName</Label>
                                <Input
                                    id="intentName"
                                    value={
                                        this.state.updateQuestionData.intentName
                                    }
                                    onChange={(e) => {
                                        let { updateQuestionData } = this.state;
                                        updateQuestionData.intentName =
                                            e.target.value;
                                        this.setState({ updateQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            {/* <FormGroup>
                                <Label for="category_id">category_id</Label>
                                <Input
                                    id="category_id"
                                    value={
                                        this.state.updateQuestionData.category_id
                                    }
                                    onChange={(e) => {
                                        let { updateQuestionData } = this.state;
                                        updateQuestionData.category_id =
                                            e.target.value;
                                        this.setState({ updateQuestionData });
                                    }}
                                ></Input>
                            </FormGroup> */}

                            <FormGroup>
                                <Label for="category_id">Select</Label>
                                <Input
                                    id="category_id"
                                    name="category_id"
                                    type="select"
                                    value={
                                        this.state.updateQuestionData
                                            .category_id
                                    }
                                    onChange={(e) => {
                                        let { updateQuestionData } = this.state;
                                        updateQuestionData.category_id =
                                            e.target.value;
                                        this.setState({ updateQuestionData });
                                    }}
                                >
                                    {categories}
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="trainingPhrase1">
                                    trainingPhrase1
                                </Label>
                                <Input
                                    id="trainingPhrase1"
                                    value={
                                        this.state.updateQuestionData
                                            .trainingPhrase1
                                    }
                                    onChange={(e) => {
                                        let { updateQuestionData } = this.state;
                                        updateQuestionData.trainingPhrase1 =
                                            e.target.value;
                                        this.setState({ updateQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="trainingPhrase2">
                                    trainingPhrase2
                                </Label>
                                <Input
                                    id="trainingPhrase2"
                                    value={
                                        this.state.updateQuestionData
                                            .trainingPhrase2
                                    }
                                    onChange={(e) => {
                                        let { updateQuestionData } = this.state;
                                        updateQuestionData.trainingPhrase2 =
                                            e.target.value;
                                        this.setState({ updateQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="trainingPhrase3">
                                    trainingPhrase3
                                </Label>
                                <Input
                                    id="trainingPhrase3"
                                    value={
                                        this.state.updateQuestionData
                                            .trainingPhrase3
                                    }
                                    onChange={(e) => {
                                        let { updateQuestionData } = this.state;
                                        updateQuestionData.trainingPhrase3 =
                                            e.target.value;
                                        this.setState({ updateQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="trainingPhrase4">
                                    trainingPhrase4
                                </Label>
                                <Input
                                    id="trainingPhrase4"
                                    value={
                                        this.state.updateQuestionData
                                            .trainingPhrase4
                                    }
                                    onChange={(e) => {
                                        let { updateQuestionData } = this.state;
                                        updateQuestionData.trainingPhrase4 =
                                            e.target.value;
                                        this.setState({ updateQuestionData });
                                    }}
                                ></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="response">response</Label>
                                <Input
                                    id="response"
                                    value={
                                        this.state.updateQuestionData.response
                                    }
                                    onChange={(e) => {
                                        let { updateQuestionData } = this.state;
                                        updateQuestionData.response =
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
                                <th>intentName</th>
                                <th>intentID</th>
                                <th>category_id</th>
                                <th>noOfInteractions</th>
                                <th>trainingPhrase1</th>
                                <th>trainingPhrase2</th>
                                <th>trainingPhrase3</th>
                                <th>trainingPhrase4</th>
                                <th>response</th>
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
