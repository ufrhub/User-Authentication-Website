/********************* Import All The Required Pakages *********************/

const FileSystem = require("fs");



/********************* Export The Middleware Functionality *********************/

module.exports = async (Request, Response, Next) => {

    try {

        const File = Request.files.File;

        if (!Request.files || Object.keys(Request.files).length === 0) {
            return Response.status(400).json({
                message: "No files were uploaded...!"
            });

        } else if (File.size > 1024 * 1024) {
            RemoveTemporary(File.tempFilePath);
            return Response.status(400).json({
                message: "Size too large...!"
            });  // 1mb

        } else if (File.mimetype !== 'image/jpeg' && File.mimetype !== 'image/png') {
            RemoveTemporary(File.tempFilePath);
            return Response.status(400).json({
                message: "File format is incorrect..!"
            });
        };

        Next();

    } catch (Error) {
        return Response.status(500).json({
            message: Error.message
        });
    };

};



/********************* Function To Remove Temporary File *********************/

const RemoveTemporary = (Path) => {

    FileSystem.unlink(Path, Error => {
        if (Error) throw Error
    });

};