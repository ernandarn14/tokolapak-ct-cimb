import React from 'react'
import { Table } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";

class ReportProduct extends React.Component {
    state = {
        productList: [],
    }

    getDataTransaction = () => {
        let total = 0
        Axios.get(`${API_URL}/products`, {
            params: {
                _embed: "transactionDetails"
            }
        })
            .then((res) => {
                console.log(res);
                // res.data.map((val) => {
                //     total += val.totalBelanja
                // })
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
        const { productList } = this.state
        return productList.map((val, idx) => {
            const { id, productName, transactionDetails } = val;
            let totalBuying = 0
            transactionDetails.map(val => {
                totalBuying += val.quantity
            })
            return (
                <>
                    <tr>
                        <td>{idx + 1}</td>
                        <td>{id}</td>
                        <td>{productName}</td>
                        <td>{totalBuying}</td>
                    </tr>
                </>
            )
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
                            <th>Nama Product</th>
                            <th>Total Buying</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderReport()}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default ReportProduct