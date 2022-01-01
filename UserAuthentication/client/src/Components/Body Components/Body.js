import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './Home/HomePage';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import NotFound from '../Utilities/NotFound';
import ActivationEmail from './Authentication/ActivationEmail';
import ForgotPassword from './Authentication/ForgotPassword';
import ResetPassword from './Authentication/ResetPassword';
import UserProfile from './Profile/UserProfile';

function Body() {

    const userAuthentication = useSelector(State => State.userAuthentication);
    const { isLoggedIn } = userAuthentication;

    return (
        <section className='Body'>
            <Switch>
                <Route path="/" component={HomePage} exact />
                <Route path="/login" component={isLoggedIn ? NotFound : Login} exact />
                <Route path="/register" component={isLoggedIn ? NotFound : Register} exact />
                <Route path="/user/activate/:Activation_Token" component={ActivationEmail} exact />
                <Route path="/forgot_password" component={isLoggedIn ? NotFound : ForgotPassword} exact />
                <Route path="/user/reset_password/:token" component={isLoggedIn ? NotFound : ResetPassword} exact />
                <Route path="/profile" component={isLoggedIn ? UserProfile : NotFound} exact />
            </Switch>
        </section>
    );

};

export default Body;