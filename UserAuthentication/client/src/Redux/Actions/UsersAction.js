import Server from 'axios';
import { GET_ALL_USERS } from '../Constants/AuthenticationConstant';

export const FetchAllUsers = async (Token) => {

    const Response = await Server.get("/user/all_users_information", {
        headers: { Authorization: Token }
    });

    return Response;

};

export const DispatchGetAllUsers = (Response) => {

    return {
        type: GET_ALL_USERS,
        payload: Response.data.users
    };

};