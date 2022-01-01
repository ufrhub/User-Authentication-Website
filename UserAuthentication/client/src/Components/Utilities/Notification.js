import React from 'react';
import './Notification.css';

export const showErrorMessage = (message) => {

    return <div className='errorMsg'>{message}</div>
    
};

export const showSuccessMessage = (message) => {

    return <div className='successMsg'>{message}</div>

};


