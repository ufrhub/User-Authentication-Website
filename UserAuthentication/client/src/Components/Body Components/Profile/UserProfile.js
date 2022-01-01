import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Server from 'axios';
import { isLength, isMatch } from '../../Utilities/Validation';
import { showSuccessMessage, showErrorMessage } from '../../Utilities/Notification';
import { FetchAllUsers, DispatchGetAllUsers } from '../../../Redux/Actions/UsersAction'

const initialState = {
    Name: "",
    Password: "",
    ConfirmPassword: "",
    Success: "",
    Error: ""
};

function UserProfile() {

    const [data, setData] = useState(initialState);
    const [avatar, setAvatar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [callback, setCallback] = useState(false);
    const userAuthentication = useSelector(State => State.userAuthentication);
    const token = useSelector(State => State.token);
    const dispatch = useDispatch();
    const users = useSelector(State => State.users);

    const { Name, Password, ConfirmPassword, Success, Error } = data;
    const { user, isAdmin } = userAuthentication;

    useEffect(() => {

        if (isAdmin) {
            return FetchAllUsers(token).then(Response => {
                dispatch(DispatchGetAllUsers(Response));
            });
        };

    }, [token, isAdmin, dispatch, callback])

    const handleChange = (e) => {

        const { name, value } = e.target;
        setData({ ...data, [name]: value, Success: "", Error: "" });

    };

    const updateUserAvatar = async (e) => {

        e.preventDefault();

        const File = e.target.files[0];

        if (!File) {
            return setData({ ...data, Success: "", Error: "No files were uploaded...!" });

        } else if (File.size > 1024 * 1024) {
            return setData({ ...data, Success: "", Error: "Size too large...!" });

        } else if (File.type !== 'image/jpeg' && File.type !== 'image/png') {
            return setData({ ...data, Success: "", Error: "File format is incorrect...!" });

        } else {
            let formData = new FormData();
            formData.append("File", File);

            setLoading(true);

            Server.post("/api/upload_avatar", formData, {
                headers: { "content-type": "multipart/form-data", Authorization: token }
            }).then(Response => {
                setLoading(false);
                setAvatar(Response.data.url);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };

    };

    const updateUserInformation = () => {

        Server.patch("/user/update", {
            Name: Name ? Name : user.Name,
            Avatar: avatar ? avatar : user.Avatar
        }, {
            headers: { Authorization: token }
        }).then(Response => {
            setData({ ...data, Success: Response.data.message, Error: "" });

        }).catch(Error => {
            setData({ ...data, Success: "", Error: Error.response.data.message });
        });

    };

    const updateUserPassword = () => {


        if (isLength(Password)) {
            return setData({ ...data, Error: "Password must be at least 8 characters...!", Success: "" });

        } else if (!isMatch(Password, ConfirmPassword)) {
            return setData({ ...data, Error: "Password did not match...!", Success: "" });

        } else {
            Server.post("/user/reset_password", { Password }, { headers: { Authorization: token } }).then(Response => {
                setData({ ...data, Error: "", Success: Response.data.message });

            }).catch(Error => {
                setData({ ...data, Error: Error.response.data.message, Success: "" });
            });
        };

    };

    const handleUpdateUserInformation = () => {

        if (Name || avatar) {
            updateUserInformation()

        } else if (Password) {
            updateUserPassword()
        };

    };

    const handleAdminChange = (id, Admin) => {

        if (user._id !== id) {
            if (Admin === true) {
                if (window.confirm("Are you sure you want to remove Admin")) {
                    setLoading(true);

                    Server.patch(`/user/update_role/${id}`, {
                        isAdmin: Admin ? false : true
                    }, {
                        headers: { Authorization: token }
                    }).then((Response) => {
                        setLoading(false);
                        setData({ ...data, Error: "", Success: Response.data.message });
                        setCallback(!callback);

                    }).catch(Error => {
                        setData({ ...data, Error: Error.response.data.message, Success: "" });
                    });
                };

            } else if (Admin === false) {
                if (window.confirm("Are you sure you want to update Admin")) {
                    setLoading(true);

                    Server.patch(`/user/update_role/${id}`, {
                        isAdmin: Admin ? false : true
                    }, {
                        headers: { Authorization: token }
                    }).then((Response) => {
                        setLoading(false);
                        setData({ ...data, Error: "", Success: Response.data.message });
                        setCallback(!callback);

                    }).catch(Error => {
                        setData({ ...data, Error: Error.response.data.message, Success: "" });
                    });
                };
            };
        }

    };

    const handleDeleteUser = (id) => {

        if (user._id !== id) {
            if (window.confirm("Are you sure you want to delete this account?")) {
                setLoading(true);

                Server.delete(`/user/delete/${id}`, {
                    headers: { Authorization: token }
                }).then(() => {
                    setLoading(false);
                    setCallback(!callback);


                }).catch(Error => {
                    setData({ ...data, Error: Error.response.data.message, Success: "" });
                });
            };
        };

    };

    return (

        <div className='UserProfile'>

            {loading && <h3>Loading.....</h3>}
            {Success && showSuccessMessage(Success)}
            {Error && showErrorMessage(Error)}

            <div className='UserProfileBody'>

                <div className='col-left'>

                    <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>

                    <div className='Avatar'>
                        <img src={avatar ? avatar : user.Avatar} alt='' />

                        <span>
                            <i className="fas fa-camera"></i>
                            <p>Change</p>
                            <input type="file" name='file' id='ProfilePicture' onChange={updateUserAvatar} />
                        </span>
                    </div>

                    <div className='UpdateProfile_Form'>
                        <label htmlFor='userName'>Name</label>
                        <input type="text" name='Name' id='userName' defaultValue={user.Name} placeholder='Your Name' onChange={handleChange} />
                    </div>

                    <div className='UpdateProfile_Form'>
                        <label htmlFor='userEmail'>Email</label>
                        <input type="email" name='Email' id='userEmail' defaultValue={user.Email} placeholder='Your Email Address' disabled />
                    </div>

                    <div className='UpdateProfile_Form'>
                        <label htmlFor='userPassword'>New Password</label>
                        <input type="password" name='Password' value={Password} id='userPassword' placeholder='Your Password' onChange={handleChange} />
                    </div>

                    <div className='UpdateProfile_Form'>
                        <label htmlFor='userConfirmPassword'>Confirm Password</label>
                        <input type="password" name='ConfirmPassword' value={ConfirmPassword} id='userConfirmPassword' placeholder='Confirm Password' onChange={handleChange} />
                    </div>

                    <div>
                        <em style={{ color: "crimson" }}>
                            * If you update your password here, you will not be able
                            to login quickly using google and facebook.
                        </em>
                    </div>

                    <button disabled={loading} onClick={handleUpdateUserInformation}>Update</button>

                </div>

                <div className='col-right'>

                    <h2>{isAdmin ? "Users" : "My Orders"}</h2>

                    <div>
                        <table className='Users'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Admin</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.Name}</td>
                                            <td>{user.Email}</td>
                                            <td>
                                                {
                                                    user.isAdmin === true
                                                        ? <i className="fas fa-toggle-on" onClick={() => handleAdminChange(user._id, user.isAdmin)}></i>
                                                        : <i className="fas fa-toggle-off" onClick={() => handleAdminChange(user._id, user.isAdmin)}></i>
                                                }
                                            </td>
                                            <td>
                                                <i className="fas fa-trash" title="Remove"
                                                    onClick={() => handleDeleteUser(user._id)}>

                                                </i>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

        </div >
    );

};

export default UserProfile;
