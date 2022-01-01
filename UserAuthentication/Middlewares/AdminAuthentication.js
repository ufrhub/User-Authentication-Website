/********************* Import The Models *********************/

const Users = require("../Models/UserModel");



/********************* Export The Middleware Functionality *********************/

exports.AdminAuthentication = (Request, Response, Next) => {

    try {

        Users.findOne({ _id: Request.user.id }).then(User => {
            if (User.isAdmin !== true) {
                Response.status(500).json({
                    message: "Admin resources access denied...!"
                });

            } else {
                Next();
            };

        }).catch(Error => {
            Response.status(500).json({
                error: Error,
                message: ""
            });
        });

    } catch (error) {
        Response.status(500).json({ message: error.message });
    };

};