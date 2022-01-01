/********************* Import The Models *********************/

const User = require("../Models/UserModel");



/********************* Import All The Required Pakages *********************/

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SendEmail = require("../Middlewares/SendEmail");
const { CLIENT_URL } = process.env;
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const Client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);
const Fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));



/********************* Export The Controller Functionality *********************/

///**************** (1) Register New Users ****************///

exports.RegisterNewUsers = (Request, Response) => {

    const {
        Name,
        Email,
        Password,
        DateOfBirth,
        isAdmin
    } = Request.body;

    if (!Name || !Email || !Password || !DateOfBirth) {
        Response.status(400).json({
            status: "Failed",
            message: "Empty fields"
        });

    } else if (!/^[a-z A-Z]*$/.test(Name)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid name entered",
        });

    } else if (!validateEmail(Email)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid email entered",
        });

    } else if (!new Date(DateOfBirth).getTime()) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid date of birth entered",
        });

    } else if (Password.length < 8) {
        Response.status(400).json({
            status: "Failed",
            message: "Passeord too short",
        });

    } else {
        // checking if user already exists
        User.find({ Email }).then(Result => {
            if (Result.length) {
                Response.status(400).json({
                    status: "Failed",
                    message: "User already exists...!",
                });

            } else {
                const saltRounds = 12;

                bcrypt.hash(Password, saltRounds).then(hashedPassword => {
                    const NewUser = {
                        Name,
                        Email,
                        Password: hashedPassword,
                        DateOfBirth,
                        isAdmin
                    };

                    const Activation_Token = createActivationToken(NewUser);
                    const URL = `${CLIENT_URL}/user/activate/${Activation_Token}`;
                    const DESCRIPTION = `Congratulations! You're almost set to start using My Website.
                    Just click the button below to validate your email address.`

                    SendEmail(Email, URL, "Verify Your Email...!", DESCRIPTION);

                    Response.status(200).json({
                        status: "SUCCESS",
                        message: "Verification Email Sent. Verify Your Email...!"
                    });

                }).catch(Error => {
                    Response.status(500).json({
                        error: Error,
                        message: "An error occured while encrypting the user password...!",
                    });
                });
            };

        }).catch(Error => {
            Response.status(500).json({
                error: Error,
                message: "An error occured while checking for existing user...!",
            });
        });
    };

};



///**************** (2) Activate Email For The New User ****************///

exports.ActivateEmail = (Request, Response) => {

    const { Activation_Token } = Request.body;
    const user = jwt.verify(Activation_Token, process.env.ACTIVATION_TOKEN_SECRET);
    const {
        Name,
        Email,
        Password,
        DateOfBirth,
        isAdmin
    } = user;

    User.find({ Email }).then(Result => {
        if (Result.length > 0) {
            Response.status(400).json({
                message: "Account record doesn't exist or has been verified already. Please sign up or log in."
            });

        } else {
            const NewUser = new User({
                Name,
                Email,
                Password,
                DateOfBirth,
                isAdmin,
                Verified: true
            });

            NewUser.save().then(Result => {
                Response.status(200).json({
                    user: Result.Name,
                    message: "Account has been activated successfully...!"
                });

            }).catch(Error => {
                Response.status(500).json({
                    error: Error,
                    message: "An error occured while saving new user...!"
                });
            });

        };

    }).catch(Error => {
        Response.status(500).json({
            error: Error,
            message: "An error occured while finding existing user...!"
        });
    });

};



///**************** (3) User Login ****************///

exports.UserLogin = (Request, Response) => {

    const {
        Email,
        Password
    } = Request.body;

    if (!Email || !Password) {
        Response.status(400).json({
            status: "Failed",
            message: "Empty fields"
        });

    } else {
        User.findOne({ Email }).then(Result => {
            if (!Result) {
                Response.status(400).json({
                    message: "This email does not exist...!"
                });

            } else {
                const userPassword = Result.Password;

                bcrypt.compare(Password, userPassword).then(isMatched => {
                    if (isMatched) {
                        const Refresh_Token = createRefreshToken({ id: Result._id });

                        Response.cookie("refreshtoken", Refresh_Token, {
                            httpOnly: true,
                            path: '/user/refresh_token',
                            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                        });

                        Response.status(200).json({
                            message: "User Logged In Successfully...!",
                        });

                    } else {
                        Response.status(400).json({
                            message: "Password is incorrect...!"
                        });
                    };

                }).catch(Error => {
                    Response.status(500).json({
                        error: Error,
                        message: "An error occured while comparing password...!"
                    });
                });
            };

        }).catch(Error => {
            Response.status(500).json({
                message: "An error occured while searching for existing user...!"
            });
        });
    }

};



///**************** (4) User Login Access Token ****************///

exports.GetAccessToken = (Request, Response) => {

    try {
        const Refresh_Token = Request.cookies.refreshtoken
        if (!Refresh_Token) {
            return Response.status(400).json({
                message: "Please login now...!"
            });

        } else {
            jwt.verify(Refresh_Token, process.env.REFRESH_TOKEN_SECRET, (Error, user) => {
                if (Error) {
                    Response.status(400).json({
                        message: "Please login now...!"
                    });

                } else {
                    const Access_Token = createAccessToken({ id: user.id })
                    Response.json({ Access_Token });
                };
            });
        };

    } catch (Error) {
        return Response.status(500).json({
            message: Error.message
        });
    };

};



///**************** (5) Forgot Password ****************///

exports.ForgotPassword = (Request, Response) => {

    const { Email } = Request.body;

    User.findOne({ Email }).then(Result => {
        if (Result) {
            const Access_Token = createAccessToken({ id: Result._id });
            const URL = `${CLIENT_URL}/user/reset_password/${Access_Token}`;
            const DESCRIPTION = "To Reset Your Password Just click the button below...!";

            SendEmail(Email, URL, "Reset your password", DESCRIPTION);

            Response.status(200).json({
                message: "Reset password link sent, please check your email...!"
            });

        } else {
            Response.status(400).json({
                message: "This email does not exist...!"
            });
        };

    }).catch(Error => {
        Response.status(500).json({
            error: Error,
            message: "An error occured while searching for an existing user...!"
        });
    });

};



///**************** (6) Reset Password ****************///

exports.ResetPassword = (Request, Response) => {

    const { Password } = Request.body;
    const saltRounds = 12;

    bcrypt.hash(Password, saltRounds).then(hashedPassword => {

        User.findOneAndUpdate({ _id: Request.user.id }, { Password: hashedPassword }).then(() => {
            Response.status(200).json({
                message: "Password successfully changed...!"
            });

        }).catch(Error => {
            Response.status(500).json({
                error: Error,
                message: "An error occured while updating new password...!"
            });
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error,
            message: "An error occured while encrypting the user's password...!"
        });
    });

};



///**************** (7) Get User Information ****************///

exports.GetUserInformation = (Request, Response) => {

    User.findById(Request.user.id).select("-Password").then(Result => {
        Response.status(200).json({
            user: Result
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error,
            message: "An error occured while finding the user's detail...!"
        });
    });

};



///**************** (8) Get All Users Information ****************///

exports.GetAllUsersInformation = (Request, Response) => {

    User.find().select("-Password").then(Result => {
        Response.status(200).json({
            users: Result
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error,
            message: "An error occured while finding the user's detail...!"
        });
    });

};



///**************** (9) Logout User ****************///

exports.LogoutUser = (Request, Response) => {

    try {
        Response.clearCookie("refreshtoken", { path: "/user/refresh_token" });
        Response.status(200).json({
            message: "Logged Out...!"
        });

    } catch (Error) {
        Response.status(500).json({
            error: Error.message
        });
    };

};



///**************** (10) Update User ****************///

exports.UpdateUser = (Request, Response) => {

    const { Name, DateOfBirth, Avatar } = Request.body;

    User.findOneAndUpdate({ _id: Request.user.id }, { Name, DateOfBirth, Avatar }).then(Result => {
        Response.status(200).json({
            message: "Successfully updated user...!",
            Name: Result.Name,
            DateOfBirth: Result.DateOfBirth,
            Avatar: Result.Avatar
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error.message,
            message: "An error occured while finding or updating user...!"
        });
    });

};



///**************** (11) Update User Role ****************///

exports.UpdateUserRole = (Request, Response) => {

    const { isAdmin } = Request.body;

    User.findOneAndUpdate({ _id: Request.params.id }, { isAdmin }).then(Result => {
        Response.status(200).json({
            message: "Successfully updated user...!",
            Name: Result.Name,
            isAdmin: Result.isAdmin
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error.message,
            message: "An error occured while finding or updating user...!"
        });
    });

};



///**************** (12) Delete User ****************///

exports.DeleteUser = (Request, Response) => {

    try {
        User.findByIdAndDelete({ _id: Request.params.id }).then(Result => {
            Response.status(200).json({
                message: "User Deleted Successfully...!"
            });

        }).catch(Error => {
            Response.status(500).json({
                error: Error.message,
                message: "An error occured while deleting user...!"
            })
        });

    } catch (Error) {
        Response.status(500).json({
            error: Error.message,
            message: "An error occured finding or deleting user...!"
        })
    };

};



///**************** (13) Google Login ****************///

exports.GoogleLogin = (Request, Response) => {

    const { TokenID } = Request.body;

    Client.verifyIdToken({ idToken: TokenID, audience: process.env.MAILING_SERVICE_CLIENT_ID }).then(Result => {
        const { email_verified, email, name, picture } = Result.payload;
        const Password = email + process.env.GOOGLE_SECRET;
        const saltRounds = 12;

        bcrypt.hash(Password, saltRounds).then(hashedPassword => {
            if (email_verified) {
                User.findOne({ Email: email }).then(ExistingUser => {
                    if (ExistingUser) {
                        bcrypt.compare(Password, ExistingUser.Password).then(isMatched => {
                            if (isMatched) {
                                const Refresh_Token = createRefreshToken({ id: ExistingUser._id });

                                Response.cookie("refreshtoken", Refresh_Token, {
                                    httpOnly: true,
                                    path: '/user/refresh_token',
                                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                                });

                                Response.status(200).json({
                                    message: "User Logged In Successfully...!",
                                });

                            } else {
                                Response.status(400).json({
                                    message: "Password is incorrect...!"
                                });
                            };

                        }).catch(Error => {
                            Response.status(500).json({
                                error: Error,
                                message: "An error occured while comparing password...!"
                            });
                        });

                    } else {
                        const NewUser = new User({
                            Name: name,
                            Email: email,
                            Password: hashedPassword,
                            Avatar: picture,
                            Verified: true
                        });

                        NewUser.save().then(newUser => {
                            const Refresh_Token = createRefreshToken({ id: newUser._id });

                            Response.cookie("refreshtoken", Refresh_Token, {
                                httpOnly: true,
                                path: '/user/refresh_token',
                                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                            });

                            Response.status(200).json({
                                message: "User Logged In Successfully...!",
                            });

                        }).catch(Error => {
                            Response.status(500).json({
                                error: Error,
                                message: "An error occured while saving new user...!"
                            });
                        });
                    };

                }).catch(Error => {
                    Response.status(500).json({
                        error: Error,
                        message: "An error occured while checking for existing user...!"
                    });
                });

            }

        }).catch(Error => {
            Response.status(500).json({
                error: Error,
                message: "An error occured while encrypting the user password...!",
            });
        });

    }).catch(Error => {
        Response.status(500).json({
            message: Error.message
        });
    });

};



///**************** (14) Facebook Login ****************///

exports.FacebookLogin = (Request, Response) => {

    const { accessToken, userID } = Request.body;
    const URL = `https://graph.facebook.com/v4.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

    Fetch(URL).then(res => res.json()).then(Result => {
        const { email, name, picture } = Result;
        const Password = email + process.env.FACEBOOK_SECRET;
        const saltRounds = 12;

        bcrypt.hash(Password, saltRounds).then(hashedPassword => {
            User.findOne({ Email: email }).then(ExistingUser => {
                if (ExistingUser) {
                    bcrypt.compare(Password, ExistingUser.Password).then(isMatched => {
                        if (isMatched) {
                            const Refresh_Token = createRefreshToken({ id: ExistingUser._id });

                            Response.cookie("refreshtoken", Refresh_Token, {
                                httpOnly: true,
                                path: '/user/refresh_token',
                                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                            });

                            Response.status(200).json({
                                message: "User Logged In Successfully...!",
                            });

                        } else {
                            Response.status(400).json({
                                message: "Password is incorrect...!"
                            });
                        };

                    }).catch(Error => {
                        Response.status(500).json({
                            error: Error,
                            message: "An error occured while comparing password...!"
                        });
                    });

                } else {
                    const NewUser = new User({
                        Name: name,
                        Email: email,
                        Password: hashedPassword,
                        Avatar: picture.data.url,
                        Verified: true
                    });

                    NewUser.save().then(newUser => {
                        const Refresh_Token = createRefreshToken({ id: newUser._id });

                        Response.cookie("refreshtoken", Refresh_Token, {
                            httpOnly: true,
                            path: '/user/refresh_token',
                            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                        });

                        Response.status(200).json({
                            message: "User Logged In Successfully...!",
                        });

                    }).catch(Error => {
                        Response.status(500).json({
                            error: Error,
                            message: "An error occured while saving new user...!"
                        });
                    });
                };

            }).catch(Error => {
                Response.status(500).json({
                    error: Error,
                    message: "An error occured while checking for existing user...!"
                });
            });

        }).catch(Error => {
            Response.status(500).json({
                error: Error,
                message: "An error occured while encrypting the user password...!",
            });
        });

    }).catch(Error => {
        Response.status(500).json({
            message: Error.message
        });
    });

};



/********************* Function To Validate Email *********************/

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


/********************* Function To Create ACTIVATION_TOKEN_SECRET *********************/

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' });
};


/********************* Function To Create ACCESS_TOKEN_SECRET *********************/

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};


/********************* Function To Create REFRESH_TOKEN_SECRET *********************/

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};