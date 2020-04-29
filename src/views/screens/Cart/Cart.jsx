import React from 'react'
import './Cart.css'
import { connect } from 'react-redux'
import Axios from 'axios'
import { API_URL } from "../../../constants/API";

class Cart extends React.Component {
    componentDidMount() {
        Axios.get(`${API_URL}/cart`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    render() {
        return (
            <div className="container">
                <div>
                    <h1>cart</h1>
        <h2>{this.props.user.username}</h2>
                    <table>
                    <tr>
                            <td>Product Name</td>
                            <td>Quantity</td>
                        </tr>
                        <tr>
                            <td>
                                
                            </td>
                            <td></td>
                        </tr>
                    </table>
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

export default connect(mapStateToProps)(Cart)