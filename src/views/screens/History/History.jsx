import React from 'react'
import { Card } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from 'sweetalert'
import { connect } from 'react-redux';



class History extends React.Component {
    state = {
        data: [],
        activeData: [],
        dataList: []
    }

    getHistoryData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                userId: this.props.user.id,
                _embed: "transactionDetails",
                status: "success"
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

    getTransactionDetails = (transactionId) => {
        Axios.get(`${API_URL}/transactionDetails`, {
          params: {
            transactionId,
            _expand: "product",
          },
        })
          .then((res) => {
            this.setState({ dataList: res.data});
          })
          .catch((err) => {
            console.log(err);
          });
      };

    renderHistory = () => {
        return this.state.data.map((val, idx) => {
            const { totalBelanja, tglBelanja } = val;
            const { productId, price, quantity, totalPrice } = val.transactionDetails[0]
            let tanggal = new Date(tglBelanja)
            return (
                <>
                    <Card className="data-wishlist" onClick={() => {
                        if (this.state.activeData.includes(idx)) {
                            this.setState({
                                activeData: [
                                    ...this.state.activeData.filter((item) => item !== idx),
                                ],
                            });
                        } else {
                            this.setState({
                                activeData: [...this.state.activeData, idx],
                            });
                        }
                    }}>
                        <div className="d-flex justify-content-around align-items-center">
                            <div className="d-flex">
                                <div className="d-flex flex-column ml-4 justify-content-center">
                                    <h5>{val.id}</h5>
                                    <h6>
                                        Total Shipping:
                      <span style={{ fontWeight: "normal" }}>
                                            {" "}
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(totalBelanja)}
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
                    <Card className={`collapse-item ${
                        this.state.activeData.includes(idx) ? "active" : null
                        } p-3`}>
                        <div className="d-flex justify-content-around align-items-center mt-3">
                            {/* <img src={val.product.image} /> */}
                            <div className="d-flex">
                                <div className="d-flex flex-column ml-4 justify-content-center">
                                    <h6>ID Product: {productId}</h6>
                                    <h6>
                                        Price:
                      <span style={{ fontWeight: "normal" }}>
                                            {" "}
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(price)}
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
                                        Sub Total:
                      <span style={{ fontWeight: "normal" }}>
                                            {" "}
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(totalPrice)}
                                        </span>
                                    </h6>

                                </div>
                            </div>
                        </div>

                    </Card>
                </>
            )
        })
    }

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