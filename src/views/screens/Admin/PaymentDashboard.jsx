import React from 'react'
import Axios from 'axios'
import { API_URL } from '../../../constants/API'
import ButtonUI from '../../components/Button/Button'
import { connect } from 'react-redux'
import swal from 'sweetalert'

class PaymentDashboard extends React.Component {
    state = {
        paymentList: [],
        activePage: "pending",
        //status: ""
    }

    getDataTransaction = (val) => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
              status: val,
            }
          })
            .then(res => {
                console.log(res)
                this.setState({
                    paymentList: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.getDataTransaction()
    }


    renderDataTransaction = () => {
        return this.state.paymentList.map((val) => {
            const { userId, totalBelanja, status, tglBelanja, id } = val;
            if (this.state.activePage == "pending" && status == "pending") {
                return (
                    <>
                        <tr>
                            <td>{userId}</td>
                            <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalBelanja)}</td>
                            <td>{status}</td>
                            <td>
                                <ButtonUI type="outlined" onClick={() => this.confirmPaymentHandler(id)}>Confirm Payment</ButtonUI>
                            </td> 
                        </tr>
                    </>
                )
            } else {
                return (
                    <>
                        <tr>
                            <td>{userId}</td>
                            <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalBelanja)}</td>
                            <td>{status}</td>
                             <td></td>
                        </tr>
                    </>
                )
            }
        })
    }

    confirmPaymentHandler = (id) => {
        Axios.patch(`${API_URL}/transactions/${id}`, {
            status: "success",
            tglSelesai: this.dateTimeFormat()
        })
        .then(res => {
            console.log(res)
            this.state.paymentList.map((val) => {
                Axios.post(`${API_URL}/history`, {
                    userId: res.data.userId,
                    totalBelanja: res.data.totalBelanja,
                    status: "success",
                    tglBelanja: this.dateTimeFormat(),
                    tglSelesai: this.dateTimeFormat()
                })
            })
            // .then(res => {
            //     console.log(res)
                swal('Success', 'Payment Confirmed', 'success')
                this.getDataTransaction()
            // })
           
        })
        .catch(err => {
            console.log(err)
            //swal('Failed', 'Payment Failed to Confirm', 'error')
        })
    }

    render() {
        return (
            <div className="container py-4">
                <caption className="p-3">
                    <h2>Payments Member</h2>
                </caption><br />
                <div className="d-flex flex-row">
                            <ButtonUI
                                className={`auth-screen-btn ${
                                    this.state.activePage == "pending" ? "active" : null
                                    }`}
                                type="outlined"
                                onClick={() => this.setState({ activePage: "pending" }, this.getDataTransaction("pending"))}
                            >
                                Pending
              </ButtonUI>
                            <ButtonUI
                                className={`ml-3 auth-screen-btn ${
                                    this.state.activePage == "success" ? "active" : null
                                    }`}
                                type="outlined"
                                onClick={() => this.setState({ activePage: "success" }, this.getDataTransaction("success"))}
                            >
                                Success
              </ButtonUI>
                        </div><br /><br />
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderDataTransaction()}</tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(PaymentDashboard) 