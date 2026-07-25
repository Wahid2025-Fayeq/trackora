const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (
  fileBuffer,
  {
    folder = "trackora/avatars",
    resourceType = "image",
    transformation,
    useFilename = false,
    uniqueFilename = true,
  } = {},
) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: useFilename,
        unique_filename: uniqueFilename,
        ...(transformation && { transformation }),
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });

module.exports = uploadToCloudinary;
