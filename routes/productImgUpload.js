// ** Essential imports
import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/product/");
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4();
    const extension = file.mimetype.split("/")[1];
    cb(null, fileName + `.${extension}`);
  },
});

const upload = multer({ storage: storage });

const productImgUpload = (app) => {
  app.post(
    "/api/product-images",
    upload.array("<PRODUCT_IMAGES>", 10),
    async (req, res) => {
      try {
        const paths = [];

        req.files.map(async (file) => {
          // converting to webp format
          const path = file.path;

          const outputImgPath = `${file.destination}converted-${
            file.filename.split(".")[0]
          }.webp`;

          paths.push(outputImgPath);

          await sharp(path)
            .toFormat("webp")
            .webp({ quality: 100 })
            .toFile(outputImgPath);
        });

        res.send({
          status: "success",
          message: "Images Uploaded",
          paths: paths,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    }
  );
};

export default productImgUpload;
