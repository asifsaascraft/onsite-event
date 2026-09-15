import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".csv",
    ".xlsx",
    ".xls",
  ];

  const extension =
    file.originalname
      .toLowerCase()
      .slice(
        file.originalname.lastIndexOf("."),
      );

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error(
        "Only CSV and Excel files are allowed.",
      ),
      false,
    );
  }

  cb(null, true);
};

const uploadRegistrationData = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
});

export default uploadRegistrationData;