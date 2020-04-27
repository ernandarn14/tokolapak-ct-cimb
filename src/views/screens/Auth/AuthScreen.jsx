import React from 'react'
import TextField from '../../components/TextField/TextField'
import ButtonUI from '../../components/Button/Button'
import { registerHandler, loginHandler } from '../../../redux/actions';
import { connect } from "react-redux";
import swal from 'sweetalert'

class AuthScreen extends React.Component {
    state = {
        userArr: [],
        username: "",
        password: "",
        repeatPass: "",
        fullName: "",
        isCondition: true,
        userLogin: "",
        passLogin: ""
    }

    inputHandler = (event, field) => {
        this.setState({ [field]: event.target.value });
    };

    isLogin = () => {
        this.setState({ isCondition: true })
    }

    isRegister = () => {
        this.setState({ isCondition: false })
    }

    registerUser = () => {
        const { username, password, repeatPass, fullName } = this.state;

        const newUser = {
            username,
            password,
            fullName,
            role: "user"
        }

        if (password == repeatPass) {
            this.props.onRegister(newUser)
            swal('Selamat', 'Register berhasil', 'success')
        } else {
            alert('Password tidak cocok')
        }
    }

    loginUser = () => {
        const { userLogin, passLogin } = this.state
        const userData = {
            username: userLogin,
            password: passLogin
        }
        this.props.onLogin(userData)
        swal('Selamat', 'Login berhasil', 'success')
    }


    render() {
        const { userLogin, passLogin, username, fullName, password, repeatPass, isCondition } = this.state
        return (
            <div className="container">
                {
                    (isCondition) ? (
                        <div className="container">
                            <div className="row mt-5 ">
                                <ButtonUI type="auth" className="m-3" onClick={this.isRegister}>Register</ButtonUI>
                                <ButtonUI type="auth" className="m-3" onClick={this.isLogin} style={{backgroundColor: "black", color: "white"}}>Login</ButtonUI>
                            </div>
                            <div className="row mt-5">
                                <div className="col-md-5">
                                    <div>
                                        <h3>Login</h3>
                                        <p className="mt-4">
                                            Welcome back,
                                    <br /> Please, login your account
                                </p>
                                        <TextField onChange={(e) => this.inputHandler(e, 'userLogin')} placeholder="Username" className="mt-5" value={userLogin} />
                                        <TextField onChange={(e) => this.inputHandler(e, 'passLogin')} placeholder="Password" className="mt-2" value={passLogin} />
                                        <div className="d-flex justify-content-center">
                                            <ButtonUI type="contained" className="mt-4" onClick={this.loginUser}>Login</ButtonUI>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-7">Picture</div>
                            </div>
                        </div>
                    ) :
                        (
                            <div className="container">
                                <div className="row mt-5 ">
                                    <ButtonUI type="auth" className="m-3" onClick={this.isRegister} style={{backgroundColor: "black", color: "white"}}>Register</ButtonUI>
                                    <ButtonUI type="auth" className="m-3" onClick={this.isLogin}>Login</ButtonUI>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-md-5">
                                        <div>
                                            <h3>Register</h3>
                                            <p className="mt-4">
                                                You get the best recommendation gadget
                            </p>
                                            <TextField onChange={(e) => this.inputHandler(e, 'username')} placeholder="Username" className="mt-5" value={username} />
                                            <TextField onChange={(e) => this.inputHandler(e, 'fullName')} placeholder="Fullname" className="mt-2" value={fullName} />
                                            <TextField onChange={(e) => this.inputHandler(e, 'password')} placeholder="Password" className="mt-2" value={password} />
                                            <TextField onChange={(e) => this.inputHandler(e, 'repeatPass')} placeholder="Repeat Password" className="mt-2" value={repeatPass} />
                                            <div className="d-flex justify-content-center">
                                                <ButtonUI type="contained" className="mt-4" onClick={this.registerUser}>Register</ButtonUI>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">Picture</div>
                                </div>
                            </div>
                        )
                }
            </div>
        )
    }
}

const stateMapToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = {
    onLogin: loginHandler,
    onRegister: registerHandler
};

export default connect(stateMapToProps, mapDispatchToProps)(AuthScreen)
