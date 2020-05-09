import React from "react";
import { connect } from "react-redux";
import "./Cart.css";
import { Link } from "react-router-dom";

import { Table, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from 'sweetalert'
import { fillCart } from "../../../redux/actions";
import { priceFormatter } from "../../../helpers/formatter";




class Cart extends React.Component {
    state = {
        cartList: [],
        methodShipping: "instant",
        modalOpen: false,
    }

    componentDidMount() {
        this.getItemCarts()
    }

    inputHandler = (e) => {
        let { value } = e.target;
        this.setState({ methodShipping: value })
    };

    getItemCarts = () => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            },
        })
            .then((res) => {
                console.log(res.data);
                this.setState({
                    cartList: res.data
                })
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
                    <td style={{ verticalAlign: "middle" }}>{idx + 1}</td>
                    <td style={{ verticalAlign: "middle" }}>{val.product.productName}</td>
                    <td style={{ verticalAlign: "middle" }}>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.product.price)}</td>
                    <td style={{ verticalAlign: "middle" }}>{val.quantity}</td>
                    <td style={{ verticalAlign: "middle" }}>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(this.renderSubTotalPrice())}</td>
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

    renderSubTotalPrice = () => {
        let totalPrice = 0;

        this.state.cartList.forEach((val) => {
            const { quantity, product } = val;
            const { price } = product;

            totalPrice += quantity * price;
        });

        return totalPrice;
    };

    renderShippingPrice = () => {
        switch (this.state.shipping) {
            case "instant":
              return priceFormatter(100000);
            case "sameday":
              return priceFormatter(50000);
            case "express":
              return priceFormatter(20000);
            default:
              return "Free";
          }
    };

    renderTotalPrice = () => {
        let totalPrice = 0;

        this.state.cartList.forEach((val) => {
            const { quantity, product } = val;
            const { price } = product;

            totalPrice += quantity * price;
        });

        let shippingPrice = 0;

        switch (this.state.methodShipping) {
            case "instant":
                shippingPrice = 100000;
                break;
            case "sameday":
                shippingPrice = 50000;
                break;
            case "express":
                shippingPrice = 20000;
                break;
            default:
                shippingPrice = 0;
                break;
        }

        return totalPrice + shippingPrice;
    };

    renderCheckOut = () => {
        const { cartList } = this.state
        return cartList.map((val, idx) => {
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{val.product.productName}</td>
                    <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.product.price)}</td>
                    <td>{val.quantity}</td>
                    <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(this.renderSubTotalPrice())}</td>
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
        Axios.post(`${API_URL}/transactions`, {
            userId: this.props.user.id,
            totalBelanja: this.renderTotalPrice(),
            status: "pending",
            tglBelanja: new Date().toLocaleString('EN-US'),
            tglSelesai: ""
        })
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
            })
            .then(res => {
                cartList.forEach(val => {
                    this.deleteCartsItem(val.id)
                });
                swal('Success', 'Transaction Success', 'success')
                this.setState({ modalOpen: false })
            })
            .then((res) => {
                this.props.fillCart(this.props.user.id);
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
                                    { style: "currency", currency: "IDR" }).format(this.renderTotalPrice())
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
                                <div className="d-flex flex-row mt-4">
                                    <label>Method Shipping</label>
                                    <select className="custom-text-input pl-3" onChange={(e) => this.inputHandler(e)}>
                                        <option value="instant">Instant</option>
                                        <option value="sameday">Same Day</option>
                                        <option value="express">Express</option>
                                        <option value="economy">Economy</option>
                                    </select>
                                </div><br />
                                <h6 style={{ fontWeight: "bold" }} onChange={(e) =>
                        this.setState({ methodShipping: e.target.value })
                      }>Shipping Price : {this.renderShippingPrice()} </h6>
                                <h6 style={{ fontWeight: "bold" }}>Total Price : {
                                    new Intl.NumberFormat("id-ID",
                                        { style: "currency", currency: "IDR" }).format(this.renderTotalPrice())
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

const mapDispatchToProps = {
    fillCart
};


export default connect(mapStateToProps, mapDispatchToProps)(Cart);
