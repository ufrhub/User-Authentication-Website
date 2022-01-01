import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Server from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../Utilities/Notification';

function ActivationEmail() {

    const { Activation_Token } = useParams();
    const [Success, setSuccess] = useState("");
    const [Error, setError] = useState("");

    useEffect(() => {

        if (Activation_Token) {

            const activationEmail = async () => {
                try {
                    const response = await Server.post('/user/activation', { Activation_Token })
                    setSuccess(response.data.message);

                } catch (Error) {
                    Error.response.data.msg && setError(Error.response.data.message);
                }
            };

            activationEmail();
        };

    }, [Activation_Token])

    return (
        <div className='ActivationEmail'>

            {Error && showErrorMessage(Error)}
            {Success && showSuccessMessage(Success)}

        </div>
    );

};

export default ActivationEmail;
