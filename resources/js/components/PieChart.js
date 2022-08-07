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

export default class QuestionCategory extends Component {
    constructor() {
        super();
        this.state = {
            categories: [],
            newCategoryModal: false,
            newCategoryData: {
                id: "",
                categoryName: "",
                noOfInteractions: "0",
            },
            updateCategoryData: {
                id: "",
                categoryName: "",
                noOfInteractions: "",
            },
            updateCategoryModal: false,
        };
    }
    loadCategory() {
        axios.get("http://127.0.0.1:8000/api/categories").then((response) => {
            this.setState({
                categories: response.data,
            });
        });
    }

    addCategory() {
        axios
            .post(
                "http://127.0.0.1:8000/api/category",
                this.state.newCategoryData
            )
            .then((response) => {
                let { categories } = this.state;
                this.loadCategory();
                this.setState({
                    categories,
                    newCategoryModal: false,
                    newCategoryData: {
                        id: "",
                        categoryName: "",
                        noOfInteractions: "0",
                    },
                });
            });
    }

    togglenewCategoryModal() {
        this.setState({
            newCategoryModal: !this.state.newCategoryModal,
        });
    }

    callUpdateCategory(id, categoryName, noOfInteractions) {
        this.setState({
            updateCategoryData: {
                id,
                categoryName,
                noOfInteractions,
            },
            updateCategoryModal: !this.state.updateCategoryModal,
        });
    }
    updatecategory() {
        let { id, categoryName, noOfInteractions } =
            this.state.updateCategoryData;
        axios
            .put(
                "http://127.0.0.1:8000/api/categoryUpdate/" +
                    this.state.updateCategoryData.id,
                {
                    categoryName,
                    noOfInteractions,
                }
            )
            .then((response) => {
                this.loadCategory();
                this.setState({
                    updateCategoryModal: false,
                    updateCategoryData: {
                        id: "",
                        categoryName: "",
                        noOfInteractions: "",
                    },
                });
            });
    }
    deleteCategory(id) {
        axios
            .delete("http://127.0.0.1:8000/api/categoryDelete/" + id)
            .then((response) => {
                this.loadCategory();
            });
    }
    componentWillMount() {
        this.loadCategory();
    }

    toggleUpdateCategoryModal() {
        this.setState({
            updateCategoryModal: !this.state.updateCategoryModal,
        });
    }
    render() {
        let categories = this.state.categories.map((category) => {
            return (
                <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.categoryName}</td>
                    <td>{category.noOfInteractions}</td>
                    <td>
                        <Button
                            color="success"
                            size="sm"
                            outline
                            onClick={this.callUpdateCategory.bind(
                                this,
                                category.id,
                                category.categoryName,
                                category.noOfInteractions
                            )}
                        >
                            Edit
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            outline
                            onClick={this.deleteCategory.bind(
                                this,
                                category.id
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
                <NavBar />
                <div className="main">
                    <h1>Database</h1>
                    <Button
                        color="primary"
                        onClick={this.togglenewCategoryModal.bind(this)}
                    >
                        Add category
                    </Button>

                    <Modal
                        isOpen={this.state.newCategoryModal}
                        toggle={this.togglenewCategoryModal.bind(this)}
                    >
                        <ModalHeader
                            toggle={this.togglenewCategoryModal.bind(this)}
                        >
                            {" "}
                            Add New category
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="categoryName">categoryName</Label>
                                <Input
                                    id="categoryName"
                                    value={
                                        this.state.newCategoryData.categoryName
                                    }
                                    onChange={(e) => {
                                        let { newCategoryData } = this.state;
                                        newCategoryData.categoryName =
                                            e.target.value;
                                        this.setState({ newCategoryData });
                                    }}
                                ></Input>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                onClick={this.addCategory.bind(this)}
                            >
                                Add category{" "}
                            </Button>{" "}
                            <Button
                                color="secondary"
                                onClick={this.togglenewCategoryModal.bind(this)}
                            >
                                {" "}
                                Cancel{" "}
                            </Button>
                        </ModalFooter>
                    </Modal>

                    <Modal
                        isOpen={this.state.updateCategoryModal}
                        toggle={this.toggleUpdateCategoryModal.bind(this)}
                    >
                        <ModalHeader
                            toggle={this.toggleUpdateCategoryModal.bind(this)}
                        >
                            {" "}
                            Update New category
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="categoryName">categoryName</Label>
                                <Input
                                    id="categoryName"
                                    value={
                                        this.state.updateCategoryData
                                            .categoryName
                                    }
                                    onChange={(e) => {
                                        let { updateCategoryData } = this.state;
                                        updateCategoryData.categoryName =
                                            e.target.value;
                                        this.setState({ updateCategoryData });
                                    }}
                                ></Input>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                onClick={this.updatecategory.bind(this)}
                            >
                                Update category{" "}
                            </Button>{" "}
                            <Button
                                color="secondary"
                                onClick={this.toggleUpdateCategoryModal.bind(
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
                                <th>categoryName</th>
                                <th>noOfInteractions</th>
                            </tr>
                        </thead>
                        <tbody>{categories}</tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

if (document.getElementById("questionCategory")) {
    ReactDOM.render(
        <QuestionCategory />,
        document.getElementById("questionCategory")
    );
}
