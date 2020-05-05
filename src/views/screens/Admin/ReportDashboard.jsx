import React from 'react'
import { Table } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";

class ReportDashboard extends React.Component {
    state = {
        userList: [],
        totalPayment: 0,
        transactionItems: {
            userId: 0,
            totalBelanja: 0,
        },
    }

    getDataTransaction = (item) => {
        let total = 0
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: item
            }
        })
            .then((res) => {
                console.log(res);
                res.data.reduce((val) => {
                    total += val.totalBelanja
                })
                this.setState({
                    userList: res.data,
                    transactionItems: {
                        ...this.state.transactionItems,
                        totalBelanja: total,
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentDidMount() {
        this.getDataTransaction();
    }

    sumData = () => {
        const { userId, totalBelanja } = this.state.userList
        this.state.userList.reduce((item, { userId, totalBelanja }) => {
            if (!item[userId]) {
                item[userId] = { userId, total: 0 }
            }
            item[userId].total += totalBelanja
            return item
        }, {})
    }

    renderReport = () => {
        return this.state.userList.map((val, idx) => {
            const { userId, totalBelanja, status } = val;
            if (status == "success") {
                return (
                    <>
                        <tr>
                            <td>{idx + 1}</td>
                            <td key={idx}>{userId}</td>
                            <td>{ new Intl.NumberFormat("id-ID",
                                        { style: "currency", currency: "IDR" }).format(totalBelanja)}</td>
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
                    <h2>Report By User</h2>
                </caption><br />
                <Table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>User ID</th>
                            <th>Total Payments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderReport("success")}
                    </tbody>
                </Table>
                <h6 style={{ fontWeight: "bold", textAlign: "right" }}>Total Payments : {
                                    new Intl.NumberFormat("id-ID",
                                        { style: "currency", currency: "IDR" }).format(this.state.transactionItems.totalBelanja)
                                } </h6>
            </div>
        )
    }
}

export default ReportDashboard