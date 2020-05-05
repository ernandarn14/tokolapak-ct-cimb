import React from "react";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { connect } from "react-redux";
import swal from "sweetalert";

class PaymentDashboard extends React.Component {
  state = {
    paymentList: [],
    activePage: "pending",
    activeData: [],
  };

  getDataTransaction = (val) => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        status: val,
        _embed: "transactionDetails",
      },
    })
      .then((res) => {
        console.log(res);
        this.setState({
          paymentList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getDataTransaction();
  }

  renderDataTransaction = () => {
    return this.state.paymentList.map((val, idx) => {
      const { userId, totalBelanja, status, tglBelanja, id } = val;
      const {
        productId,
        price,
        quantity,
        totalPrice,
      } = val.transactionDetails[0];
      if (this.state.activePage == "pending" && status == "pending") {
        return (
          <>
            <tr
              onClick={() => {
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
              }}
            >
              <td>{userId}</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalBelanja)}
              </td>
              <td>{status}</td>
              <td>
                <ButtonUI
                  type="outlined"
                  onClick={() => this.confirmPaymentHandler(id)}
                >
                  Confirm Payment
                </ButtonUI>
              </td>
            </tr>
            <tr
              className={`collapse-item ${
                this.state.activeData.includes(idx) ? "active" : null
                }`}
            >
              <td className="" colSpan={4}>
                <div className="d-flex justify-content-around align-items-center">
                  <div className="d-flex">
                    <div className="d-flex flex-column ml-4 justify-content-center">
                      <h5>{productId}</h5>
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
              </td>
            </tr>
          </>
        );
      } else {
        return (
          <>
            <tr
              onClick={() => {
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
              }}
            >
              <td>{userId}</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalBelanja)}
              </td>
              <td>{status}</td>
              <td></td>
            </tr>
            <tr
              className={`collapse-item ${
                this.state.activeData.includes(idx) ? "active" : null
                }`}
            >
              <td className="" colSpan={4}>
                <div className="d-flex justify-content-around align-items-center">
                  <div className="d-flex">
                    <div className="d-flex flex-column ml-4 justify-content-center">
                      <h5>{productId}</h5>
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
              </td>
            </tr>
          </>
        );
      }
    });
  };

  confirmPaymentHandler = (id) => {
    Axios.patch(`${API_URL}/transactions/${id}`, {
      status: "success",
      tglSelesai: this.dateTimeFormat(),
    })
      .then((res) => {
        console.log(res);
        this.state.paymentList.map((val) => {
          Axios.post(`${API_URL}/history`, {
            userId: res.data.userId,
            totalBelanja: res.data.totalBelanja,
            status: "success",
            tglBelanja: this.dateTimeFormat(),
            tglSelesai: this.dateTimeFormat(),
          });
        });
        // .then(res => {
        //     console.log(res)
        swal("Success", "Payment Confirmed", "success");
        this.getDataTransaction();
        // })
      })
      .catch((err) => {
        console.log(err);
        //swal('Failed', 'Payment Failed to Confirm', 'error')
      });
  };

  render() {
    return (
      <div className="container py-4">
        <caption className="p-3">
          <h2>Payments Member</h2>
        </caption>
        <br />
        <div className="d-flex flex-row">
          <ButtonUI
            className={`auth-screen-btn ${
              this.state.activePage == "pending" ? "active" : null
              }`}
            type="outlined"
            onClick={() =>
              this.setState(
                { activePage: "pending" },
                this.getDataTransaction("pending")
              )
            }
          >
            Pending
          </ButtonUI>
          <ButtonUI
            className={`ml-3 auth-screen-btn ${
              this.state.activePage == "success" ? "active" : null
              }`}
            type="outlined"
            onClick={() =>
              this.setState(
                { activePage: "success" },
                this.getDataTransaction("success")
              )
            }
          >
            Success
          </ButtonUI>
        </div>
        <br />
        <br />
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(PaymentDashboard);
