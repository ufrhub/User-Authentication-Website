/********************* Import JSONWEBTOKEN *********************/

const jwt = require("jsonwebtoken");



/********************* Export The Middleware Functionality *********************/

exports.Authentication = (Request, Response, Next) => {

    try {
        const Token = Request.header("Authorization");
        if (!Token) {
            Response.status(400).json({
                message: "Invalid Authentication...!"
            });

        } else {
            jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
                if (error) {
                    Response.status(400).json({
                        message: "Invalid Authentication...!"
                    });

                } else {
                    Request.user = user;
                    Next();
                };
            });
        };

    } catch (error) {
        Response.status(500).json({ message: error.message });
    };

};