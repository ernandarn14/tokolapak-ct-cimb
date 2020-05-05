import React from 'react'
import { Card } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import "./Wishlist.css";
import ButtonUI from "../../components/Button/Button";
import swal from 'sweetalert'
import { connect } from 'react-redux';



class Wishlist extends React.Component {
    state = {
        // dataWishlist: {
        //     userId: 0,
        //     items: []
        // },
        dataList: [],
        cartList: []
    }

    getWishlistData = () => {
        Axios.get(`${API_URL}/wishlists`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            },
        })
            .then((res) => {
                console.log(res.data)
                this.setState({ dataList: res.data});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    renderWishlist = () => {
        return this.state.dataList.map(val => {
            return (
                <Card className="data-wishlist">
                    <div className="d-flex justify-content-around align-items-center">
                        <div className="d-flex">
                            <img src={val.product.image} alt="" style={{ width: "224px", height: "250px", objectFit: "contain" }} />
                            <div className="d-flex flex-column ml-4 justify-content-center">
                                <h5>{val.product.productName}</h5>
                                <h6 className="mt-2">
                                    Category:
                      <span style={{ fontWeight: "normal" }}> {val.product.category}</span>
                                </h6>
                                <h6>
                                    Price:
                      <span style={{ fontWeight: "normal" }}>
                                        {" "}
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(val.product.price)}
                                    </span>
                                </h6>
                                <h6>
                                    Description:
                      <span style={{ fontWeight: "normal" }}> {val.product.desc}</span>
                                </h6>
                                <div className="d-flex flex-row mt-4">
                                    <ButtonUI onClick={() => this.addToCartHandler(val.product.productId)}>Add To Cart</ButtonUI>
                                    <ButtonUI className="ml-4" type="outlined" onClick={() => this.deleteWishlist(val.id)}>Delete</ButtonUI>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )
        })
    }

    deleteWishlist = (id) => {
        Axios.delete(`${API_URL}/wishlists/${id}`)
            .then(res => {
                console.log(res.data)
                this.getWishlistData()
                swal('Success', 'Wishlist Item Removed', 'success')
            })
            .catch(err => {
                console.log(err);
                swal('Failed', 'Wishlist Item Failed to Remove', 'error')
            })
    }

    componentDidMount() {
        this.getWishlistData();
    }

    addToCartHandler = (id) => {
        Axios.get(`${API_URL}/carts`)
        .then(res => {
            console.log(res.data)
            if (res.data.length > 0) {
                Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
                    quantity: res.data[0].quantity + 1
                })
                    .then(res => {
                        console.log(res);
                        swal('Success', 'Item Added To Cart', 'success')
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                Axios.post(`${API_URL}/carts`, {
                    userId: this.props.user.id,
                    productId: id,
                    quantity: 1
                })
                    .then(res => {
                        console.log(res);
                        swal('Success', 'Item Added To Cart', 'success')
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        });
    };

    render() {
        return (
            <div className="container py-4">
                <caption className="p-3">
                    <h2>Wishlist</h2>
                </caption><br /><br />
                <div>
                    {this.renderWishlist()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};


export default connect(mapStateToProps)(Wishlist) 