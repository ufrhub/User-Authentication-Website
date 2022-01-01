import { GET_ALL_USERS } from '../Constants/AuthenticationConstant';

const users = [];

const UsersReducer = (State = users, Action) => {
    
    switch (Action.type) {
        case GET_ALL_USERS:
            return Action.payload

        default:
            return State
    };

};

export default UsersReducer;