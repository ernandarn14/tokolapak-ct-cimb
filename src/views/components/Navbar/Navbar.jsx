import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import ButtonUI from "../Button/Button";
import { logoutHandler, filterHandler } from "../../../redux/actions";
import Axios from "axios";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
    cartList: 0
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {
    this.props.onLogout();
    // this.forceUpdate();
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  componentDidMount() {
    this.getItemCarts()
  }

  getItemCarts = () => {
    let total = 0
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
      },
    })
      .then((res) => {
        console.log(res.data);
        // res.data.map((val) => {
        //   total += val.quantity
        // })
        this.setState({
          cartList: res.data.length
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderTotalCart = () => {
    const { cartList } = this.state
    return cartList.map((val) => {
      return val.productId
    })
  }

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={(e) => this.props.onFilter(e.target.value)}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
              }`}
            type="text"
            placeholder="Cari produk impianmu disini"
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.props.user.id ? (
            <>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.username}</p>
                </DropdownToggle>
                <DropdownMenu className="mt-2">
                  {this.props.user.role == 'admin' ? (
                    <>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/dashboard"
                        >
                          Dashboard
                    </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/member"
                        >
                          Members
                    </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/payment"
                        >
                          Payments
                    </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/report"
                        >
                          Reports By User
                    </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/reportProduct"
                        >
                          Reports By Product
                    </Link>
                      </DropdownItem>
                    </>) : (
                      <>
                        <DropdownItem>
                          <Link to="/wishlist"
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            Wishlist
                    </Link>
                        </DropdownItem>
                        <DropdownItem>   <Link to="/history"
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            History
                    </Link></DropdownItem>
                      </>
                    )}
                </DropdownMenu>
              </Dropdown>
              <Link
                className="d-flex flex-row"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                    {/* {this.renderTotalCart()} */}
                    {/* {this.state.cartList} */}
                    {this.props.user.cartItems}
                  </small>
                </CircleBg>
              </Link>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to="/"
              >
                <ButtonUI
                  onClick={this.logoutBtnHandler}
                  className="ml-3"
                  type="textual"
                >
                  Logout
              </ButtonUI>
              </Link>

            </>
          ) : (
              <>
                <ButtonUI className="mr-3" type="textual">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/auth"
                  >
                    Sign in
                </Link>
                </ButtonUI>
                <ButtonUI type="contained">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/auth"
                  >
                    Sign up
                </Link>
                </ButtonUI>
              </>
            )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = {
  onLogout: logoutHandler,
  onFilter: filterHandler
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);