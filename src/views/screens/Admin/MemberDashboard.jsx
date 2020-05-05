import React from 'react'
import Axios from 'axios';
import { API_URL } from '../../../constants/API';
import "./AdminDashboard.css"
import ButtonUI from "../../components/Button/Button";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class MemberDashboard extends React.Component {
    state = {
        userList: [],
        editForm: {
            id: 0,
            username: "",
            fullName: 0,
            email: ""
        },
        modalOpen: false
    }

    getUserList = () => {
        Axios.get(`${API_URL}/users`)
            .then((res) => {
                this.setState({ userList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.getUserList()
    }

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };

    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.userList[idx],
            },
            modalOpen: true,
        });
    };

    editProductHandler = () => {
        Axios.put(
            `${API_URL}/users/${this.state.editForm.id}`,
            this.state.editForm
        )
            .then((res) => {
                swal("Success!", "Your item has been edited", "success");
                this.setState({ modalOpen: false });
                this.getUserList();
            })
            .catch((err) => {
                swal("Error!", "Your item could not be edited", "error");
                console.log(err);
            });
    };

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    deleteHandler = (id) => {
        Axios.delete(`${API_URL}/users/${id}`)
            .then(res => {
                console.log(res)
                this.getProductList()
                swal('Success', 'User Removed', 'success')
            })
            .catch(err => {
                swal('Failed', 'User Failed to Remove', 'error')
            })
    }



    renderUser = () => {
        return this.state.userList.map((val, idx) => {
            const { id, username, fullName, role } = val;
            if (role == "user") {
            return (
                <>
                    <tr>
                        <td>{id}</td>
                        <td>{username}</td>
                        <td>{fullName}</td>
                        <td> <div className="d-flex flex-column align-items-center">
                            <ButtonUI
                                onClick={(_) => this.editBtnHandler(idx)}
                                type="contained"
                            >
                                Edit
                  </ButtonUI>
                            <ButtonUI className="mt-3" type="textual" onClick={() => this.deleteHandler(id)}>
                                Delete
                  </ButtonUI>
                        </div></td>
                    </tr>
                </>
            )}
        })

    }
    render() {
        return (
            <div className="container py-4">
                <caption className="p-3">
                    <h2>Data Member</h2>
                </caption><br /><br />
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Fullname</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderUser()}</tbody>
                </table>
                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit User</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                    <h5>Username: {this.state.editForm.username}</h5>
                        <div className="row">
                            {/* <div className="col-4"> */}
                                {/* <TextField
                                    value={this.state.editForm.username}
                                    placeholder="Username" disabled
                                /> */}
                            {/* </div> */}
                            <div className="col-10">
                                <TextField
                                    value={this.state.editForm.fullName}
                                    placeholder="Fullname"
                                    onChange={(e) => this.inputHandler(e, "fullName", "editForm")}
                                />
                            </div>
                            <div className="col-5 mt-3 offset-1">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.toggleModal}
                                    type="outlined"
                                >
                                    Cancel
                </ButtonUI>
                            </div>
                            <div className="col-5 mt-3">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.editProductHandler}
                                    type="contained"
                                >
                                    Save
                </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
export default MemberDashboard