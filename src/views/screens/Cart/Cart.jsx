import React from "react";
import { connect } from "react-redux";
import "./Cart.css";
import { Link } from "react-router-dom";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Alert } from 'reactstrap'


class Cart extends React.Component {
    state = {
        cartList: [],
    }
    componentDidMount() {
        this.getItemCarts()
    }

    getItemCarts = () => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            },
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ cartList: res.data })
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
                    <td><ButtonUI onClick={() => this.deleteCartsItem(val.id)}>Delete</ButtonUI></td>
                </tr>
            )
        })
    }

    deleteCartsItem = (id) => {
        Axios.delete(`${API_URL}/carts/${id}`)
            .then(res => {
                console.log(res.data)
                this.getItemCarts()
                alert("Carts Berhasil Dihapus")
            })
            .catch(err => {
                console.log(err);
                alert("Cart Gagal Dihapus")
            })
    }

    render() {
        if (this.state.cartList > 0) {
            return (
                <div className="container" >
                    <h1>Cart Details</h1> <br />
                    <h5>Username: {this.props.user.username}</h5>
                    <table className="table table-striped text-center align-item-center">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderCarts()}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (
                <div className="container mt-5">
                    <Alert>Cart Kosong
                <Link to="/"> Silahkan Belanja</Link>
                    </Alert>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};


export default connect(mapStateToProps)(Cart);
