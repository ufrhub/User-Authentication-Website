import Server from 'axios';
import { USER_LOGIN, GET_USER_DETAILS } from '../Constants/AuthenticationConstant';

export const DispatchUserLogin = () => {

    return {
        type: USER_LOGIN
    }

};

export const FetchUser = async (Token) => {

    const Response = await Server.get("/user/information", {
        headers: { Authorization: Token }
    });

    return Response;

};

export const DispatchGetUser = (Response) => {

    return {
        type: GET_USER_DETAILS,
        payload: {
            user: Response.data.user,
            isAdmin: Response.data.user.isAdmin
        }
    };

};