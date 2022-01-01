import { combineReducers } from 'redux';
import AuthenticationReducer from './AuthenticationReducer';
import UsersReducer from './UsersReducer';
import TokenReducer from './TokenReducer';


const Reducer = combineReducers({

    userAuthentication: AuthenticationReducer,
    users: UsersReducer,
    token: TokenReducer

});

export default Reducer;