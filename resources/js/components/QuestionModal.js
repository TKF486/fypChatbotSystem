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
    FormText,
    FormFeedback,
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
            checkedBoxes: [],
            quesID_List: [],
            toggleCheckbox: this.toggleCheckbox.bind(this),
            toggleBulkDelete: this.toggleBulkDelete.bind(this),

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
    loadQuestion = () => {
        axios.get("http://127.0.0.1:8000/api/questions").then((response) => {
            this.setState({
                questions: response.data,
            });
        });
    };

    loadCategory() {
        axios.get("http://127.0.0.1:8000/api/categories").then((response) => {
            this.setState({
                categories: response.data,
            });
        });
    }

    loadQuestionID() {
        axios
            .get("http://127.0.0.1:8000/api/quesIDRetrieve")
            .then((response) => {
                this.setState({
                    quesID_List: response.data,
                });
            });
    }

    addQuestion() {
        if ($("#intentName").val() == "") {
            // alert("intentName can not be left blank");
            $("#intentName").addClass("is-invalid ");
        } else {
            $("#intentName").removeClass("is-invalid ");
            $("#intentName").addClass("is-valid ");
        }

        if ($("#trainingPhrase1").val() == "") {
            // alert("trainingPhrase1 can not be left blank");
            $("#trainingPhrase1").addClass("is-invalid ");
        } else {
            $("#trainingPhrase1").removeClass("is-invalid ");
            $("#trainingPhrase1").addClass("is-valid ");
        }

        if ($("#response").val() == "") {
            // alert("response can not be left blank");
            $("#response").addClass("is-invalid ");
        } else {
            $("#response").removeClass("is-invalid ");
            $("#response").addClass("is-valid ");
        }

        if (
            $("#intentName").val() != "" &&
            $("#trainingPhrase1").val() != "" &&
            $("#response").val() != ""
        ) {
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
            alert("Intent successfully created!");
        } else {
            // alert(
            //     "intentName, trainingPhrase1 && response field cannot be empty!"
            // );
        }
    }

    togglenewQuestionModal() {
        this.setState({
            newQuestionModal: !this.state.newQuestionModal,
        });
    }

    toggleBulkImport() {
        window.location.href = "/import";
    }

    toggleBulkDelete = () => {
        var confirmBulkDelete = confirm(
            "Are you sure you want to delete " + "all the selected intent?"
        );
        if (confirmBulkDelete == true) {
            if ($("input#checkbox").is(":checked")) {
                let id_list = JSON.stringify(this.state.checkedBoxes);
                axios
                    .delete(
                        "http://127.0.0.1:8000/api/questionBulkDelete/" +
                            id_list
                    )
                    .then((response) => {
                        this.loadQuestion();
                    });

                this.clearCheckbox();
                // this.loadQuestion();
            } else {
                alert("No Checkbox is selected");
            }
            alert("All selected intents are successfully deleted!");
        } else {
        }
    };

    clearCheckbox() {
        this.setState({ checkedBoxes: [] });

        // remove all checkbox select
        $("input#checkbox").prop("checked", false);
    }

    selectAllCheckBox() {
        let selected = $("input#checkbox").is(":checked");

        if (selected) {
            // is selected now need to remove all
            $("input#checkbox").prop("checked", false);
            this.setState({ checkedBoxes: [] });
        } else {
            $("input#checkbox").prop("checked", true);
            this.setState({ checkedBoxes: this.state.quesID_List });
        }

        // alert($("input#checkbox").is(":checked"));
    }

    deleteQuestion(id) {
        // console.log(id);
        var confirmDelete = confirm(
            "Are you sure you want to delete " + "Intent with id: " + id + "?"
        );
        if (confirmDelete == true) {
            this.clearCheckbox();
            axios
                .delete("http://127.0.0.1:8000/api/questionDelete/" + id)
                .then((response) => {
                    this.loadQuestion();
                });
            alert("Intent with id: " + id + " successfully deleted!");
        } else {
        }
    }

    toggleCheckbox = (e, question) => {
        if (e.target.checked) {
            let arr = this.state.checkedBoxes;
            arr.push(question.id);

            this.setState({ checkedBoxes: arr });
        } else {
            // console.log("splice done");

            // this.setState({
            //     checkedBoxes: question,
            // });

            var question = _.without(this.state.checkedBoxes, question.id);

            this.setState({
                checkedBoxes: question,
            });
        }
        console.log(this.state.checkedBoxes);
    };

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
        if ($("#intentName").val() == "") {
            // alert("intentName can not be left blank");
            $("#intentName").addClass("is-invalid ");
        } else {
            $("#intentName").removeClass("is-invalid ");
            $("#intentName").addClass("is-valid ");
        }

        if ($("#trainingPhrase1").val() == "") {
            // alert("trainingPhrase1 can not be left blank");
            $("#trainingPhrase1").addClass("is-invalid ");
        } else {
            $("#trainingPhrase1").removeClass("is-invalid ");
            $("#trainingPhrase1").addClass("is-valid ");
        }

        if ($("#response").val() == "") {
            // alert("response can not be left blank");
            $("#response").addClass("is-invalid ");
        } else {
            $("#response").removeClass("is-invalid ");
            $("#response").addClass("is-valid ");
        }

        if (
            $("#intentName").val() != "" &&
            $("#trainingPhrase1").val() != "" &&
            $("#response").val() != ""
        ) {
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
        } else {
            // alert(
            //     "intentName, trainingPhrase1 && response field cannot be empty!"
            // );
        }
        alert(
            "Intent with id: " +
                this.state.updateQuestionData.id +
                " successfully updated!"
        );
    }

    componentWillMount() {
        this.loadQuestion();
        this.loadCategory();
        this.loadQuestionID();
    }

    toggleUpdateQuestionModal() {
        this.setState({
            updateQuestionModal: !this.state.updateQuestionModal,
        });
    }
    render() {
        let questions = this.state.questions.map((question, index) => {
            return (
                <tr key={index}>
                    <td>
                        <input
                            id="checkbox"
                            type="checkbox"
                            value={question.id}
                            checked={this.state.checkedBoxes.find(
                                (p) => p.id === question.id
                            )}
                            onChange={(e) => this.toggleCheckbox(e, question)}
                        />
                    </td>
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
                    <h1>Intent Database</h1>
                    <Button
                        color="primary"
                        onClick={this.selectAllCheckBox.bind(this)}
                    >
                        Select All
                    </Button>
                    <Button
                        color="primary"
                        onClick={this.togglenewQuestionModal.bind(this)}
                    >
                        Add Question
                    </Button>

                    <Button
                        color="primary"
                        onClick={this.toggleBulkImport.bind(this)}
                    >
                        Bulk Import Question
                    </Button>

                    <Button color="danger" onClick={this.toggleBulkDelete}>
                        Bulk Delete Question
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
                                <FormFeedback>
                                    Please enter some input!
                                </FormFeedback>
                                <FormText>
                                    *Give a short name that represents the name
                                    of the intent e.g.AssignTime
                                </FormText>
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

                                <FormText>
                                    *Select a category class for the question
                                </FormText>
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
                                <FormFeedback>
                                    Please enter some input!
                                </FormFeedback>
                                <FormText>
                                    *Input the 1st question or keyword that
                                    might be ask by the student
                                </FormText>
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
                                <FormText>
                                    Input the 2nd question or keyword that might
                                    be ask by the student *optional
                                </FormText>
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
                                <FormText>
                                    Input the 3rd question or keyword that might
                                    be ask by the student *optional
                                </FormText>
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
                                <FormText>
                                    Input the 4th question or keyword that might
                                    be ask by the student *optional
                                </FormText>
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
                                <FormFeedback>
                                    Please enter some input!
                                </FormFeedback>
                                <FormText>
                                    *Input the response to the student after
                                    they type in related keyword
                                </FormText>
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
                            Update Existing Question
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
                                <FormText>
                                    *Give a short name that represents the name
                                    of the intent e.g.AssignTime
                                </FormText>
                            </FormGroup>

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
                                <FormText>
                                    *Select a category class for the question
                                </FormText>
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
                                <FormText>
                                    *Input the 1st question or keyword that
                                    might be ask by the student
                                </FormText>
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
                                <FormText>
                                    Input the 2nd question or keyword that might
                                    be ask by the student *optional
                                </FormText>
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
                                <FormText>
                                    Input the 3rd question or keyword that might
                                    be ask by the student *optional
                                </FormText>
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
                                <FormText>
                                    Input the 4th question or keyword that might
                                    be ask by the student *optional
                                </FormText>
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
                                <FormText>
                                    *Input the response to the student after
                                    they type in related keyword
                                </FormText>
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
                                <th>#</th>
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
