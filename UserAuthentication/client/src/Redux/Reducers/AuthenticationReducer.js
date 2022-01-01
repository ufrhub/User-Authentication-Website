import { USER_LOGIN, GET_USER_DETAILS } from '../Constants/AuthenticationConstant';

const initialState = {
    user: [],
    isLoggedIn: false,
    isAdmin: false
};

const AuthenticationReducer = (State = initialState, Action) => {

    switch (Action.type) {
        case USER_LOGIN:
            return {
                ...State,
                isLoggedIn: true
            }

        case GET_USER_DETAILS:
            return {
                ...State,
                user: Action.payload.user,
                isAdmin: Action.payload.isAdmin
            }

        default:
            return State
    };

};

export default AuthenticationReducer;