import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Server from 'axios';
import Header from './Components/Header Components/Header';
import Body from './Components/Body Components/Body';
import { DispatchUserLogin, FetchUser, DispatchGetUser } from './Redux/Actions/AuthenticationAction';

function App() {

  const dispatch = useDispatch();
  const token = useSelector(State => State.token);
  const userAuthentication = useSelector(State => State.userAuthentication);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");

    if (firstLogin) {
      const getToken = () => {
        Server.post("/user/refresh_token", null).then(Response => {
          dispatch({ type: "GET_TOKEN", payload: Response.data.Access_Token })

        }).catch(Error => {
          console.log(Error);
        });
      };

      getToken();
    };

  }, [userAuthentication.isLoggedIn, dispatch]);

  useEffect(() => {

    if (token) {
      const getUser = () => {
        dispatch(DispatchUserLogin());

        return FetchUser(token).then(Response => {
          dispatch(DispatchGetUser(Response));
        });
      };

      getUser();
    };

  }, [token, dispatch]);

  return (
    <Router>
      <div className="App">
        <Header />
        <Body />
      </div>
    </Router>
  );

};

export default App;
