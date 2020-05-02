import React, { useState } from "react";
import { connect } from "react-redux";
import "./Cart.css";
import { Link } from "react-router-dom";

import { Table, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from 'sweetalert'




class Cart extends React.Component {
    state = {
        cartList: [],
        transactionList: [],
        totalPrice: 0,
        modalOpen: false
        
    }

    componentDidMount() {
        this.getItemCarts()
    }

    getItemCarts = () => {
        let subTotal = 0
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            },
        })
            .then((res) => {
                console.log(res.data);
                res.data.map((val) => {
                    subTotal += val.quantity * val.product.price
                })
                this.setState({ cartList: res.data, totalPrice: subTotal})
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renderCarts = () => {
        const { cartList } = this.state
        return cartList.map((val, idx) => {
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{val.product.productName}</td>
                    <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.product.price)}</td>
                    <td>{val.quantity}</td>
                    <td><img src={val.product.image} style={{ height: "150px", width: "100px", objectFit: "contain" }} /></td>
                    <td><ButtonUI onClick={() => this.deleteCartsItem(val.id)} type="outlined">Delete</ButtonUI></td>
                </tr>
            )
        })
    }

    deleteCartsItem = (id) => {
        Axios.delete(`${API_URL}/carts/${id}`)
            .then(res => {
                console.log(res.data)
                this.getItemCarts()
                swal('Success', 'Cart Item Removed', 'success')
            })
            .catch(err => {
                console.log(err);
                swal('Failed', 'Cart Item Failed to Remove', 'error')
            })
    }

    renderCheckOut = () => {
        const { cartList } = this.state
        let subTotal = 0
        return cartList.map((val, idx) => {
            subTotal = val.quantity * val.product.price
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{val.product.productName}</td>
                    <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.product.price)}</td>
                    <td>{val.quantity}</td>
                    <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(subTotal)}</td>
                </tr>
            )
        })
    }

    checkOutHandler = () => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
            .then(res => {
                res.data.map(val => {
                    this.deleteCartsItem(val.id)
                    this.setState({ transactionList: [...this.state.transactionList, val.product] })
                })
                Axios.post(`${API_URL}/transactions`, {
                    userId: this.props.user.id,
                    totalPrice: this.state.totalPrice,
                    status: "pending",
                    items: this.state.transactionList,
                })
                    .then(res => {
                        console.log(res)
                        swal('Success', 'Transaction Success', 'success')
                    })
                    .catch(err => {
                        console.log(err)
                        swal('Failed', 'Transaction Failed', 'error')
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    render() {
        return (
            <div className="container py-4">
                {this.state.cartList.length > 0 ? (
                    <>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderCarts()}</tbody>
                        </Table>
                        <div className="d-flex justify-content-center">
                            <ButtonUI className="ml-4" type="contained" onClick={this.toggleModal}>Check Out</ButtonUI>
                        </div>
                        <Modal
                            toggle={this.toggleModal}
                            isOpen={this.state.modalOpen}
                            className="checkout-modal"
                        >
                            <ModalHeader toggle={this.toggleModal}>
                                <caption>
                                    <h3>Checkout</h3>
                                </caption>
                            </ModalHeader>
                            <ModalBody>
                                <h5>Username: {this.props.user.username}</h5><br />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Sub Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>{this.renderCheckOut()}</tbody>
                                </Table>
                                <h6 style={{ fontWeight: "bold" }}>Total Price : {
                                    new Intl.NumberFormat("id-ID",
                                        { style: "currency", currency: "IDR" }).format(this.state.totalPrice)
                                } </h6>
                            </ModalBody>
                            <ModalFooter>
                                <ButtonUI type="contained" onClick={this.checkOutHandler}>Confirm</ButtonUI>
                            </ModalFooter>
                        </Modal>
                    </>

                ) : (
                        <Alert>
                            Your cart is empty! <Link to="/">Go shopping</Link>
                        </Alert>
                    )}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};


export default connect(mapStateToProps)(Cart);
