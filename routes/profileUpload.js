// ** Essential imports
import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/profile/");
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4();
    const extension = file.mimetype.split("/")[1];
    cb(null, fileName + `.${extension}`);
  },
});

const upload = multer({ storage: storage });

const profileUpload = (app) => {
  app.post(
    "/api/profile-picture",
    upload.single("<PROFILE_PICTURE>"),
    async (req, res) => {
      try {
        // converting to webp format
        const path = req.file.path;
        const outputImgPath = `${req.file.destination}converted-${
          req.file.filename.split(".")[0]
        }.webp`;

        await sharp(path)
          .toFormat("webp")
          .webp({ quality: 100 })
          .toFile(outputImgPath);

        res.send({
          status: "success",
          message: "Image Uploaded",
          path: outputImgPath,
          fileName: req.file.fileName,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    }
  );
};

export default profileUpload;
