/********************* Import All The Required Pakages *********************/

const Cloudinary = require("cloudinary");
const FileSystem = require("fs");



Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});



exports.UploadAvatar = (Request, Response) => {

    try {

        const File = Request.files.File

        Cloudinary.v2.uploader.upload(File.tempFilePath, {
            folder: "Avatar",
            width: 150,
            height: 150,
            crop: "fill"
        }).then(Result => {
            Response.status(200).json({
                url: Result.secure_url
            });

        }).catch(Error => {
            RemoveTemporary(File.tempFilePath);
            Response.status(500).json({
                message: Error.message
            });
        });

    } catch (Error) {
        Response.status(500).json({
            message: Error.message
        });
    }

};



/********************* Function To Remove Temporary File *********************/

const RemoveTemporary = (Path) => {

    FileSystem.unlink(Path, Error => {
        if (Error) throw Error
    });

};