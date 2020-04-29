import React from 'react'
import './ProductDetails.css'
import ButtonUI from '../../components/Button/Button'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";
import swal from 'sweetalert'

class ProductDetails extends React.Component {
    state = {
        // productList: [],
        productList: {
            image: "",
            productName: "",
            price: 0,
            desc: "",
            category: "",
            id: 0
        }
    }

    addToCartHandler = () => {
        Axios.post(`${API_URL}/cart`, {
            userId: this.props.user.id,
            productId: this.state.productList.id,
            quantity: 1
        })
            .then(res => {
                console.log(res)
                swal('Selamat', 'Item berhasil ditambah di Add To Cart', 'success')
            })
            .catch(err => {
                console.log(err)
            })
    }
    componentDidMount() {
        // const { productList: [] } = this.state;
        Axios.get(`${API_URL}/products/${this.props.match.params.id}`)
            .then((res) => {
                console.log(res)
                this.setState({ productList: res.data })
            })
            .catch((err) => {
                alert('Data Kosong')
            })
    }
    render() {
        const { productList } = this.state;
        return (
            <div className="container">
                <div className="row py-4">
                    <div className="col-6 text-center">
                        <img src={productList.image}
                            alt="" style={{ width: "100%", objectFit: "contain", height: "550px" }} />
                    </div>
                    <div className="col-6 d-flex flex-column justify-content-center">
                        <h3>{productList.productName}</h3>
                        <h4>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(productList.price)
                        }</h4>
                        <p className="mt-4">
                            {productList.desc}
                        </p>
                        <div className="d-flex flex-row mt-4">
                            <ButtonUI onClick={this.addToCartHandler}>Add To Cart</ButtonUI>
                            <ButtonUI className="ml-4" type="outlined">Add To Wishlist</ButtonUI>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }

}

export default connect(mapStateToProps)(ProductDetails)