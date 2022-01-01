import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Server from 'axios';

function Header() {

    const userAuthentication = useSelector(State => State.userAuthentication);
    const { user, isLoggedIn } = userAuthentication;

    const LogOutHandler = () => {

        Server.get("/user/logout").then(() => {
            localStorage.removeItem("firstLogin");
            window.location.href = "/";

        }).catch(() => {
            window.location.href = "/";
        });

    };

    const userProfile = () => {

        return (
            <li className='Dropdown-nav'>
                <Link to="#" className='Avatar'>
                    <img src={user.Avatar} alt="" />  {user.Name} <i className="fas fa-angle-down"></i>
                </Link>
                <ul className='Dropdown'>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/" onClick={LogOutHandler}>Logout</Link></li>
                </ul>
            </li>
        );

    };

    const Transform = {
        transform: isLoggedIn ? "translateY(-5px)" : 0
    };

    return (
        <header>

            <div className='Header'>

                <div className='logo'>
                    <h1><Link to="/">UFr*Hub</Link></h1>
                </div>

                <ul  style={Transform} className='header-ul'>
                    <li><Link to="/cart"><i className="fas fa-shopping-cart"></i> Cart</Link></li>

                    {
                        isLoggedIn
                            ? userProfile()
                            : <li><Link to="/login"><i className="fas fa-user"></i> Sign In</Link></li>
                    }
                </ul>

            </div>

        </header>
    );

};

export default Header;