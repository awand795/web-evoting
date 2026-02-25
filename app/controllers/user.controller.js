const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");

exports.getAllUser = async (req, res) => {
  try {
    const data = await User.find({}).populate("roles", "-__v");
    res.send({ data: data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching users." });
  }
};

exports.getFindUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findById(id).populate("roles", "-__v");
    if (!data) {
      return res.status(404).send({ message: "User not found." });
    }
    res.send({ data: data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching user." });
  }
};

exports.editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 8);
    }

    const data = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!data) {
      return res.status(404).send({ message: "User not found." });
    }
    res.send({ message: "Success", data: data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error updating user." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).send({ message: "User not found." });
    }
    res.send({ message: "Success" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error deleting user." });
  }
};
