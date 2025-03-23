import User from "../models/User.js";
import path from "path";


export const AddUser = async (req, res) => {
  try {
    const userData = {
      ...req.body,
    };

    if (req.file && req.file.path) {
      userData.resume = req.file.path;
    }

    const user = await User.create(userData);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      ...(req.body.urls && {
        urls: req.body.urls.map((url) => JSON.parse(url)),
      }),
      ...(req?.file?.path && { resume: req.file.path }),
    };
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = user.generateAuthToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const resumeUrl = `${user.resume}`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=file.pdf");

    res.sendFile(path.resolve(resumeUrl));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

