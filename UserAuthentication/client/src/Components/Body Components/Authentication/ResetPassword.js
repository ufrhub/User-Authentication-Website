import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Server from 'axios';
import { isLength, isMatch } from '../../Utilities/Validation';
import { showSuccessMessage, showErrorMessage } from '../../Utilities/Notification'

const initialState = {
    Password: "",
    ConfirmPassword: "",
    Success: "",
    Error: ""
};

function ResetPassword() {

    const [data, setData] = useState(initialState);
    const { Password, ConfirmPassword, Success, Error } = data;
    const { token } = useParams();

    const handleChangeInput = (e) => {

        const { name, value } = e.target;
        setData({ ...data, [name]: value, Success: "", Error: "" });

    };

    const handleResetPassword = () => {

        if (isLength(Password)) {
            return setData({ ...data, Error: "Password must be at least 8 characters...!", Success: "" });

        } else if (!isMatch(Password, ConfirmPassword)) {
            return setData({ ...data, Error: "Password did not match...!", Success: "" });

        } else {
            Server.post("/user/reset_password", { Password }, { headers: { Authorization: token } }).then(Response => {
                setData({ ...data, Error: "", Success: Response.data.message });

            }).catch(Error => {
                Error.response.data.message && setData({ ...data, Error: Error.response.data.message, Success: "" })
            });
        };

    };

    return (
        <div className='ResetPassword'>

            <h2>Reset Your Password</h2>

            <div className='row'>
                {Success && showSuccessMessage(Success)}
                {Error && showErrorMessage(Error)}

                <div>
                    <label htmlFor='userPassword'>Password: </label>
                    <input type="password" placeholder='Enter Your Password' id='userPassword' value={Password} name='Password' onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor='confirmUserPassword'>Confirm Password: </label>
                    <input type="password" placeholder='Re-Enter Your Password' id='confirmUserPassword' value={ConfirmPassword} name='ConfirmPassword' onChange={handleChangeInput} />
                </div>

                <button onClick={handleResetPassword}>Reset Password</button>
            </div>

        </div>
    );

};

export default ResetPassword;
