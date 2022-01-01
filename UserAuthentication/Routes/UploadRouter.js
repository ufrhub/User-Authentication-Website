/********************* Import The Router *********************/

const Router = require("express").Router();



/********************* Import The Controllers *********************/

const UploadImageController = require("../Controllers/UploadImageController");
const UploadImageMiddleware = require("../Middlewares/UploadImageMiddleware");
const AuthenticationController = require("../Middlewares/Authentication");



/********************* Declare The Routes And Bind With The Controller Or Middleware Methods *********************/

Router.post("/api/upload_avatar", UploadImageMiddleware, UploadImageController.UploadAvatar)



/********************* Export The Router *********************/

module.exports = Router;