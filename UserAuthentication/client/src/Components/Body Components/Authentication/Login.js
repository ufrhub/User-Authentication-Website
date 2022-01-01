import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import Server from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../Utilities/Notification';
import { DispatchUserLogin } from '../../../Redux/Actions/AuthenticationAction';
import { useDispatch } from 'react-redux';

const initialState = {
    Email: "",
    Password: "",
    Error: "",
    Success: ""
};

function Login() {

    const [user, setUser] = useState(initialState);
    const { Email, Password, Error, Success } = user;
    const dispatch = useDispatch();
    const history = useHistory();

    const handleChangeInput = (e) => {

        const { name, value } = e.target;
        setUser({ ...user, [name]: value, Error: "", Success: "" });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        Server.post('/user/login', { Email, Password }).then(Response => {
            setUser({ ...user, Error: "", Success: Response.data.message });

            localStorage.setItem('firstLogin', true);

            dispatch(DispatchUserLogin());
            history.push("/");

        }).catch(Error => {
            Error.response.data.message &&
                setUser({ ...user, Error: Error.response.data.message, Success: '' });
        });

    };

    const responseGoogle = (Response) => {

        Server.post("/user/google_login", { TokenID: Response.tokenId }).then(Result => {
            setUser({ ...user, Error: "", Success: Result.data.message });

            localStorage.setItem('firstLogin', true);

            dispatch(DispatchUserLogin());
            history.push("/");

        }).catch(Error => {
            Error.response.data.message &&
                setUser({ ...user, Error: Error.response.data.message, Success: '' });
        });

    };

    const responseFacebook = (Response) => {

        const { accessToken, userID } = Response;
        Server.post("/user/facebook_login", { accessToken, userID }).then(Result => {
            setUser({ ...user, Error: "", Success: Result.data.message });

            localStorage.setItem('firstLogin', true);

            dispatch(DispatchUserLogin());
            history.push("/");

        }).catch(Error => {
            Error.response.data.message &&
                setUser({ ...user, Error: Error.response.data.message, Success: '' });
        });
    }

    return (
        <div className='Login'>

            <h2>Login</h2>

            {Error && showErrorMessage(Error)}
            {Success && showSuccessMessage(Success)}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='userEmail'>Email: </label>
                    <input type="email" placeholder='Enter Your Email' id='userEmail' value={Email} name='Email' onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor='userPassword'>Password: </label>
                    <input type="password" placeholder='Enter Your Password' id='userPassword' value={Password} name='Password' onChange={handleChangeInput} />
                </div>

                <div className='row'>
                    <button type='submit'>Login</button>
                    <Link to="/forgot_password">Forgot Password ?</Link>
                </div>

                <p>New User? <Link to="/register">Register</Link></p>
            </form>

            <div className='hr'>Or Login With</div>

            <div className='Social'>
                <GoogleLogin
                    clientId="178819070312-kvf216qdvu2bbrh3vs0nhmjmeoe53b4k.apps.googleusercontent.com"
                    buttonText="Google Login"
                    onSuccess={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />

                <FacebookLogin
                    appId="939741816969362"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                />
            </div>

        </div>
    );

};

export default Login;
