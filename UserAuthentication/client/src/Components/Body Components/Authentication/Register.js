import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Server from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../Utilities/Notification';
import { isEmpty, isValid, isLength, isMatch } from '../../Utilities/Validation';

const initialState = {
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    DateOfBirth: "",
    Error: "",
    Success: ""
};

function Register() {

    const [user, setUser] = useState(initialState);
    const { Name, Email, Password, ConfirmPassword, DateOfBirth, Error, Success } = user;

    const handleChangeInput = (e) => {

        const { name, value } = e.target;
        setUser({ ...user, [name]: value, Error: "", Success: "" });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (isEmpty(Name) || isEmpty(Password) || isEmpty(DateOfBirth)) {
           return setUser({ ...user, Error: "Please fill in all fields...!", Success: "" });

        } else if (!isValid(Email)) {
           return setUser({ ...user, Error: "Invalid email...!", Success: "" });

        } else if (isLength(Password)) {
           return setUser({ ...user, Error: "Password must be at least 8 characters...!", Success: "" });

        } else if (!isMatch(Password, ConfirmPassword)) {
           return setUser({ ...user, Error: "Password did not match...!", Success: "" });

        } else {
            Server.post('/user/register', { Name, Email, Password, DateOfBirth }).then(Response => {
                setUser({ ...user, Error: "", Success: Response.data.message });

            }).catch(Error => {
                Error.response.data.message &&
                    setUser({ ...user, Error: Error.response.data.message, Success: "" });
            });
        };

    };

    return (
        <div className='Register'>

            <h2>Create an account</h2>

            {Error && showErrorMessage(Error)}
            {Success && showSuccessMessage(Success)}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='userName'>Name: </label>
                    <input type="text" placeholder='Enter Your Name' id='userName' value={Name} name='Name' onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor='userEmail'>Email: </label>
                    <input type="email" placeholder='Enter Your Email' id='userEmail' value={Email} name='Email' onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor='userPassword'>Password: </label>
                    <input type="password" placeholder='Enter Your Password' id='userPassword' value={Password} name='Password' onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor='confirmUserPassword'>Confirm Password: </label>
                    <input type="password" placeholder='Re-Enter Your Password' id='confirmUserPassword' value={ConfirmPassword} name='ConfirmPassword' onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor='userDateOfBirth'>Date Of Birth: </label>
                    <input type="date" placeholder='Date Of Birth' id='userDateOfBirth' value={DateOfBirth} name='DateOfBirth' onChange={handleChangeInput} />
                </div>

                <div className='row'>
                    <button type='submit'>Create an account</button>
                </div>

                <p>Already an account? <Link to="/login">Login</Link></p>
            </form>

        </div>
    );

};

export default Register;
