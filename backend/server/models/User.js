import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema, model } = mongoose;

// import multer from "multer";
// import path from "path";

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const eeoSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});


const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  last_name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  phone: {
    type: String,
    required: [true, "Please enter phone number"]
  },
  location: {
    type: String,
  },
  resume: {
    type: String,
  },
  urls: [urlSchema],
  eeo: [eeoSchema],
});


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.checkPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: "user", name: this.name },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return token;
};

export default model("User", userSchema);

// userSchema.pre("save", async function (next) {
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//       cb(
//         null,
//         file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//       );
//     },
//   });

//   // Initialize multer upload
//   const upload = multer({ storage: storage });
//   console.log(this.resume);
//   if (this.resume) {
//     upload.single("file");
//   }
//   const salt = await bycrypt.genSalt(10);
//   this.password = await bycrypt.hash(this.password, salt);
//   next();
// });

