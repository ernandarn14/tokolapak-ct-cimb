import React from 'react'
import { Table } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import user from '../../../redux/types/user';
import { truncateSync } from 'fs';

class ReportDashboard extends React.Component {
    state = {
        userList: [],
        totalPayment: [],
        transactionItems: {
            userId: 0,
            totalBelanja: 0,
        },
    }

    getDataTransaction = (item) => {
        let total = 0
        Axios.get(`${API_URL}/transactions`)
            .then((res) => {
                console.log(res);
                res.data.map((val) => {
                    total += val.totalBelanja
                })
                //let a = 0
                // for (var i=0; i< res.data.length; i++) {
                //     a += res.data[userId].totalBelanja;
                // }
                this.setState({
                    userList: res.data,
                    transactionItems: {
                        ...this.state.transactionItems,
                        totalBelanja: total,
                       // totalPayment: a
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

    getTotalPayment = () => {
        this.state.userList.reduce((sum, userList) => sum + userList.totalBelanja, 0)
    }

    renderReport = () => {
        const {userList} = this.state
        let total = 0
        return this.state.userList.map((val, idx) => {
            const { userId, totalBelanja, status } = val;
            //let total = userList.reduce((sum, userList) => sum + userList.totalBelanja, 0);
            if (status == "success") {
                return (
                    <>
                        <tr>
                            <td>{idx + 1}</td>
                            <td>{userId}</td>
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