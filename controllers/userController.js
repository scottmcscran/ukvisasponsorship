const { catchAsync } = require("../utils/catchAsync");
const multer = require("multer");
const r2 = require("../utils/r2");

const User = require(`./../models/userModel`);
const Job = require(`./../models/jobModel`);
const AppError = require("../utils/appError");

const factory = require(`./handlerFactory`);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log("UpdateMe Req Body:", req.body);
  console.log("UpdateMe Req File:", req.file);

  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        `This route is not for password changes. Head over to /updatePassword`,
        400
      )
    );

  const filteredBody = filterObj(req.body, `name`, `email`);

  if (req.user.role === "employer" && req.body.companyProfile) {
    const allowedCompanyFields = [
      "companyName",
      "website",
      "industry",
      "companySize",
      "description",
    ];

    Object.keys(req.body.companyProfile).forEach((key) => {
      if (allowedCompanyFields.includes(key)) {
        filteredBody[`companyProfile.${key}`] = req.body.companyProfile[key];
      }
    });
  }

  if (req.file) {
    let ext = req.file.mimetype.split("/")[1];
    if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      ext = "docx";
    } else if (req.file.mimetype === "application/msword") {
      ext = "doc";
    }

    const filename = `user-${req.user.id}-${Date.now()}.${ext}`;
    await r2.uploadFile(req.file.buffer, filename, req.file.mimetype);
    filteredBody.cv = filename;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: `success`,
    updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res) => {
  if (req.user.cv) {
    try {
      await r2.deleteFile(req.user.cv);
    } catch (err) {
      console.error(
        "Failed to delete CV from R2 during account deletion:",
        err
      );
    }
  }

  // Delete all jobs posted by this user
  if (req.user.role === "employer") {
    await Job.deleteMany({ postedBy: req.user.id });
  }

  await User.findByIdAndDelete(req.user.id);

  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(204).json({
    status: `success`,
    message: null,
  });
});
exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype &&
    (file.mimetype.startsWith("application/pdf") ||
      file.mimetype.startsWith("application/msword") ||
      file.mimetype.startsWith(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ))
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not a valid file! Please upload only PDF or Word documents.",
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadCv = upload.single("cv");

exports.deleteCv = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.cv) {
    try {
      await r2.deleteFile(user.cv);
    } catch (err) {
      console.log("Error deleting file from R2:", err);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $unset: { cv: 1 } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
