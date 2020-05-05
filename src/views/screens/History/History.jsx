import React from 'react'
import { Card } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from 'sweetalert'
import { connect } from 'react-redux';



class History extends React.Component {
    state = {
        data: []
    }

    getHistoryData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                userId: this.props.user.id,
                // _embed: "products",
                _embed: "transactionDetails"
            },
        })
            .then((res) => {
                console.log(res.data)
                this.setState({ data: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    renderHistory = () => {
        return this.state.data.map(val => {
            const { totalBelanja, tglBelanja } = val;
            const { quantity } = val.transactionDetails[0]
            let tanggal = new Date(tglBelanja)
            return (
                <Card className="data-wishlist">
                    <div className="d-flex justify-content-around align-items-center">
                        <div className="d-flex">
                            {/* <img src={image} alt="" style={{ width: "224px", height: "250px", objectFit: "contain" }} /> */}
                            <div className="d-flex flex-column ml-4 justify-content-center">
                                <h5>{val.id}</h5>
                                <h6>
                                    Price:
                      <span style={{ fontWeight: "normal" }}>
                                        {" "}
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(totalBelanja)}
                                    </span>
                                </h6>
                                <h6>
                                    Quantity:
                      <span style={{ fontWeight: "normal" }}>
                                        {" "}
                                        {quantity}
                                    </span>
                                </h6>
                                <h6>
                                    Date Checkout:
                      <span style={{ fontWeight: "normal" }}>
                                        {" "}
                                        {tanggal.toLocaleString('en-GB')}
                                    </span>
                                </h6>
                            </div>
                        </div>
                    </div>
                </Card>
            )
        })
    }

    // deleteWishlist = (id) => {
    //     Axios.delete(`${API_URL}/wishlists/${id}`)
    //         .then(res => {
    //             console.log(res.data)
    //             this.getWishlistData()
    //             swal('Success', 'Wishlist Item Removed', 'success')
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             swal('Failed', 'Wishlist Item Failed to Remove', 'error')
    //         })
    // }

    componentDidMount() {
        this.getHistoryData();
    }

    render() {
        return (
            <div className="container py-4">
                <caption className="p-3">
                    <h2>History Payments</h2>
                </caption><br /><br />
                <div>
                    {this.renderHistory()}
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


export default connect(mapStateToProps)(History) 