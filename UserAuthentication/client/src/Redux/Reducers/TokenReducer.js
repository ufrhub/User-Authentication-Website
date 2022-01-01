import { GET_TOKEN } from '../Constants/AuthenticationConstant';

const token = ''

const TokenReducer = (State = token, Action) => {
    
    switch (Action.type) {
        case GET_TOKEN:
            return Action.payload

        default:
            return State
    };

};

export default TokenReducer;