import React from 'react'
import { Table } from 'reactstrap'
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import user from '../../../redux/types/user';
import { truncateSync } from 'fs';

class ReportDashboard extends React.Component {
    state = {
        userList: [],
    }

    getDataTransaction = (item) => {
        let total = 0
        let totalPayment = 0
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "success",
                _expand: "user",
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
        let userArr = [];

        this.state.userList.forEach((val) => {
          let findUserIdx = userArr.findIndex(
            (user) => user.username === val.user.username
          );
    
          if (findUserIdx !== -1) {
            // Check apakah user sudah tertampung
            // Belom ada = -1
            // !== -1 -> sudah ada
            userArr[findUserIdx].total += val.totalBelanja;
          } else {
            userArr.push({
              username: val.user.username,
              total: val.totalBelanja,
            });
          }
        });

        return userArr.map((val) => {
          return (
            <tr>
              <td>{val.username}</td>
              <td>{new Intl.NumberFormat("id-ID",
                             { style: "currency", currency: "IDR" }).format(val.total)}</td>
            </tr>
          );
        });
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

