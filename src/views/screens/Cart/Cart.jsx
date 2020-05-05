import React from "react";
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
        transactionItems: {
            userId: 0,
            totalBelanja: 0,
            status: "pending",
            tglBelanja: new Date(),
            tglSelesai: "",
        },
        methodShipping: "Economy",
        priceShipping: 0,
        modalOpen: false,
        //totalBelanja: 0, 
    }

    componentDidMount() {
        this.getItemCarts()
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

    getItemCarts = () => {
        let subTotal = 0
        let totalPrice = 0
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
                totalPrice += subTotal 
                this.setState({
                    cartList: res.data, transactionItems: {
                        ...this.state.transactionItems,
                        userId: this.props.user.id,
                        totalBelanja: totalPrice,
                        status: "pending",
                        tglBelanja: new Date(),
                        tglSelesai: ""
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renderCarts = () => {
        let subTotal = 0
        const { cartList } = this.state
        return cartList.map((val, idx) => {
            subTotal = val.quantity * val.product.price
            return (
                <tr>
                    <td style={{ verticalAlign: "middle" }}>{idx + 1}</td>
                    <td style={{ verticalAlign: "middle" }}>{val.product.productName}</td>
                    <td style={{ verticalAlign: "middle" }}>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.product.price)}</td>
                    <td style={{ verticalAlign: "middle" }}>{val.quantity}</td>
                    <td style={{ verticalAlign: "middle" }}>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(subTotal)}</td>
                    <td><img src={val.product.image} style={{ height: "150px", width: "100px", objectFit: "contain" }} /></td>
                    <td style={{ verticalAlign: "middle" }}>
                        <ButtonUI onClick={() => this.deleteCartsItem(val.id)} type="outlined">Delete</ButtonUI>
                        {/* <input type="checkbox" onChange={(e) => this.checkboxHandler(e,idx)} className="form-control"/> */}
                    </td>
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

    dateTimeFormat = () => {
        let date = new Date()
        return date.toLocaleString('en-GB') + " - " + date.toLocaleTimeString('en-US')
    }

    checkOutHandler = () => {
        const { cartList } = this.state
        Axios.post(`${API_URL}/transactions`, this.state.transactionItems)
            .then(res => {
                console.log(res)
                cartList.map((val) => {
                    Axios.post(`${API_URL}/transactionDetails`, {
                        transactionId: res.data.id,
                        productId: val.productId,
                        price: val.product.price,
                        quantity: val.quantity,
                        totalPrice: val.product.price * val.quantity
                    })
                })
                cartList.forEach(val => {
                    this.deleteCartsItem(val.id)
                });
                swal('Success', 'Transaction Success', 'success')
                this.setState({ modalOpen: false, cartList: [] })
            })
            .catch(err => {
                console.log(err)
                swal('Failed', 'Transaction Failed', 'error')
            })
    }



    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    checkboxHandler = (e, idx) => {
        const { checked } = e.target;

        if (checked) {
            this.setState({ checkOutItems: [...this.state.checkOutItems, idx] })
        } else {
            this.setState({
                checkOutItems: [
                    ...this.state.checkOutItems.filter(val => val !== idx)
                ]
            });
        }
    };

    getpriceShipping = () => {
        let totalPayment = 0
        const {methodShipping, priceShipping} = this.state
        // this.state.transactionItems.map(val => {
        //     this.state.transactionItems.totalBelanja + (val.product.price * val.quantity)
        // })
        if (methodShipping == "instant"){
            this.setState({priceShipping: 100000})
            totalPayment += priceShipping
        } else if(methodShipping == "sameday"){
            this.setState({priceShipping: 50000})
        } else if (methodShipping == "express"){
            this.setState({priceShipping: 20000})
        } else {
            this.setState({priceShipping: 0})
        }
        //this.setState({totalPayment =})
    }

    render() {
        return (
            <div className="container py-4">
                {this.state.cartList.length > 0 ? (
                    <>
                        <Table className="tabelCart">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Sub Total</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderCarts()}</tbody>
                        </Table>
                        <div className="d-flex flex-row mt-4 justify-content-between">
                            <h6 style={{ fontWeight: "bold" }}>Total Price : {
                                new Intl.NumberFormat("id-ID",
                                    { style: "currency", currency: "IDR" }).format(this.state.transactionItems.totalBelanja)
                            } </h6>
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
                                <h6 style={{ fontWeight: "bold", textAlign: "right" }}>Total Price : {
                                    new Intl.NumberFormat("id-ID",
                                        { style: "currency", currency: "IDR" }).format(this.state.transactionItems.totalBelanja)
                                } </h6>
                                <div className="d-flex flex-row mt-4">
                                    <label>Method Shipping</label>
                                    <select className="custom-text-input pl-3"  onChange={(e) => this.inputHandler(e, "methodShipping", "transactionItems")}>
                                        <option value="instant">Instant</option>
                                        <option value="sameday">Sameday</option>
                                        <option value="express">Express</option>
                                        <option value="economy">Economy</option>
                                    </select>
                                </div>
                                <h6 style={{ fontWeight: "bold" }} onChange={(e) => this.inputHandler(e, "methodShipping", "transactionItems")}>Shipping Price : {
                                    new Intl.NumberFormat("id-ID",
                                        { style: "currency", currency: "IDR" }).format(this.state.transactionItems.methodShipping)
                                } </h6>
                                <h6 style={{ fontWeight: "bold" }}>Total Payments : {
                                    new Intl.NumberFormat("id-ID",
                                        { style: "currency", currency: "IDR" }).format(this.state.transactionItems.totalBelanja)
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
