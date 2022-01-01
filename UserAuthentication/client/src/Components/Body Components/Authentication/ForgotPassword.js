import React, { useState } from 'react';
import Server from 'axios';
import { isValid, isEmpty } from '../../Utilities/Validation';
import { showSuccessMessage, showErrorMessage } from '../../Utilities/Notification'

const initialState = {
    Email: "",
    Success: "",
    Error: ""
};

function ForgotPassword() {

    const [data, setData] = useState(initialState);
    const { Email, Success, Error } = data;


    const handleChangeInput = (e) => {

        const { name, value } = e.target;
        setData({ ...data, [name]: value, Error: "", Success: "" });

    };

    const SendPasswordResetLink = () => {

        if (isEmpty(Email)) {
            return setData({ ...data, Success: "", Error: "Please enter your email...!" });
            
        } else if (!isValid(Email)) {
            return setData({ ...data, Success: "", Error: "Invalid Email...!" });

        } else {
            Server.post("/user/forgot_password", { Email }).then(Response => {
                return setData({ ...data, Success: Response.data.message, Error: "" });

            }).catch(Error => {
                Error.response.data.message && setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };

    };

    return (
        <div className='ForgotPassword'>

            <h2>Forgot Your Password?</h2>

            <div className='row'>
                {Success && showSuccessMessage(Success)}
                {Error && showErrorMessage(Error)}

                <div>
                    <label htmlFor='userEmail'>Email: </label>
                    <input type="email" placeholder='Enter Your Email' id='userEmail' value={Email} name='Email' onChange={handleChangeInput} />
                </div>

                <button onClick={SendPasswordResetLink}>Verify Your Email</button>
            </div>

        </div>
    );

};

export default ForgotPassword;
