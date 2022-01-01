/********************* Import The Required Pakages *********************/

require("dotenv").config();
const Express = require("express");
const BodyParser = require("body-parser");
const Mongoose = require("mongoose");
const CookieParser = require("cookie-parser");
const FileUpload = require("express-fileupload");
const Path = require("path");



/********************* Import The Routes *********************/

const UserRouter = require("./Routes/UserRouter");
const UploadRouter = require("./Routes/UploadRouter");



/********************* Initialise The Libraries *********************/

const App = Express();
App.use(BodyParser.json());
App.use(Express.urlencoded({ extended: true }));
App.use(CookieParser());
App.use(FileUpload(
    {
        useTempFiles: true
    }
));



/********************* Handle The CORS *********************/

App.use((request, response, next) => {

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();

});



/********************* Start Using The Routes *********************/

App.use("/", UserRouter);
App.use("/", UploadRouter);



/********************* Declare The PORT *********************/

const PORT = process.env.PORT || 5000;



/********************* Connect To MongoDB *********************/

const URI = process.env.MONGODB_URL;

Mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(Success => {
    console.log("Connected to MongoDB");

    ///**************** Start The Server ****************///

    App.listen(PORT, () => {
        console.log(`Server is listening at Port : ${PORT}`)
    });

}).catch(Error => {
    console.log("Connection Error" + Error);
});



/********************* Deploy App *********************/

if (process.env.NODE_ENV === "production") {

    App.use(Express.static("client/build"))
    App.get('*', (Request, Response) => {
        Response.sendFile(Path.join(__dirname, 'client', 'build', 'index.html'));
    });

};