/********************* Import The Router *********************/

const Router = require("express").Router();



/********************* Import The Controllers *********************/

const UserController = require("../Controllers/UserController");
const AuthenticationController = require("../Middlewares/Authentication");
const AdminAuthenticationController = require("../Middlewares/AdminAuthentication");



/********************* Declare The Routes And Bind With The Controller Or Middleware Methods *********************/

Router.post("/user/register", UserController.RegisterNewUsers);
Router.post("/user/activation", UserController.ActivateEmail);
Router.post("/user/login", UserController.UserLogin);
Router.post("/user/refresh_token", UserController.GetAccessToken);
Router.post("/user/forgot_password", UserController.ForgotPassword);
Router.post("/user/reset_password", AuthenticationController.Authentication, UserController.ResetPassword);
Router.get("/user/information", AuthenticationController.Authentication, UserController.GetUserInformation);
Router.get("/user/all_users_information", AuthenticationController.Authentication, AdminAuthenticationController.AdminAuthentication, UserController.GetAllUsersInformation);
Router.get("/user/logout", UserController.LogoutUser);
Router.patch("/user/update", AuthenticationController.Authentication, UserController.UpdateUser);
Router.patch("/user/update_role/:id", AuthenticationController.Authentication, AdminAuthenticationController.AdminAuthentication, UserController.UpdateUserRole);
Router.delete("/user/delete/:id", AuthenticationController.Authentication, AdminAuthenticationController.AdminAuthentication, UserController.DeleteUser);



Router.post("/user/google_login", UserController.GoogleLogin);
Router.post("/user/facebook_login", UserController.FacebookLogin);



/********************* Export The Router *********************/

module.exports = Router;