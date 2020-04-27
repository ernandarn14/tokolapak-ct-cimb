import React from 'react'
import TextField from '../../components/TextField/TextField'
import ButtonUI from '../../components/Button/Button'

class AuthScreen extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row mt-5 ">
                <ButtonUI type="auth" className="m-3">Register</ButtonUI>
                <ButtonUI type="auth" className="m-3">Login</ButtonUI>
                </div>
                <div className="row mt-5">
                    <div className="col-md-5">
                        <div>
                            <h3>Login</h3>
                            <p className="mt-4">
                                Welcome back,
                                <br /> Please, login your account
                            </p>
                            <TextField placeholder="Username" className="mt-5" />
                            <TextField placeholder="Password" className="mt-2" />
                            <div className="d-flex justify-content-center">
                                <ButtonUI type="contained" className="mt-4">Login</ButtonUI>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">Picture</div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-5">
                        <div>
                            <h3>Register</h3>
                            <p className="mt-4">
                                You get the best recommendation gadget
                            </p>
                            <TextField placeholder="Username" className="mt-5" />
                            <TextField placeholder="Fullname" className="mt-2" />
                            <TextField placeholder="Password" className="mt-2" />
                            <TextField placeholder="Repeat Password" className="mt-2" />
                            <div className="d-flex justify-content-center">
                                <ButtonUI type="contained" className="mt-4">Register</ButtonUI>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">Picture</div>
                </div>
            </div>
        )
    }
}

export default AuthScreen
