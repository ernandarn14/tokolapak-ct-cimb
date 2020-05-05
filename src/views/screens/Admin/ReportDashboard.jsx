import React from 'react'
import { Table } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import user from '../../../redux/types/user';
import { truncateSync } from 'fs';

class ReportDashboard extends React.Component {
    state = {
        userList: [],
        // totalPayment: [],
        // transactionItems: {
        //     userId: 0,
        //     totalBelanja: 0,
        // },
    }

    getDataTransaction = (item) => {
        let total = 0
        let totalPayment = 0
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "success",
                _expand: "user",
                _embed: "transactionDetails"
            }
            })
            .then((res) => {
                console.log(res)
                this.setState({userList: res.data});
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentDidMount() {
        this.getDataTransaction();
    }

    renderReport = () => {
        const { userList } = this.state
        let totalPayment = 0
        //let userArr = []
        return userList.map((val, idx) => {
            const { userId, totalBelanja, status, transactionDetails, user  } = val;
            const {username} = user

            let userIdx = userList.findIndex(val => val.username==username)
            //userList[userIdx].totalPayment += totalBelanja
            if (status == "success") {
                return (
                    <>
                        <tr>
                            <td>{idx + 1}</td>
                            <td>{username}</td>
                            <td key={userId}>{new Intl.NumberFormat("id-ID",
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
                            <th>Username</th>
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

export default ReportDashboard

