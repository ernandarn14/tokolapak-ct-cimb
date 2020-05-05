import React from 'react'
import { Table } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";

class ReportProduct extends React.Component {
    state = {
        productList: [],
        totalPayment: 0,
    }

    getDataTransaction = (item) => {
        let total = 0
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: item,
                _embed: "transactionDetails"
            }
        })
            .then((res) => {
                console.log(res);
                res.data.map((val) => {
                    total += val.totalBelanja
                })
                this.setState({
                    productList: res.data
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentDidMount() {
        this.getDataTransaction();
    }

    renderReport = () => {
        return this.state.productList.map((val, idx) => {
             const {  status } = val;
            const { productId, quantity } = val.transactionDetails[0]
            if (status == "success") {
                return (
                    <>
                        <tr>
                            <td>{idx + 1}</td>
                            <td>{productId}</td>
                            <td>{quantity}</td>
                        </tr>
                    </>
                )
            }
        })
    }


    render() {
        return (
            <div className="container py-4">
                <caption className="p-3">
                    <h2>Report By Product</h2>
                </caption><br />
                <Table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>ID Product</th>
                            <th>Total Payments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderReport("success")}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default ReportProduct