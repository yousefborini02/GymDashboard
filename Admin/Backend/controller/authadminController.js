const GymAccount = require("../models/GymAccount"); // Import GymAccount model instead of Admin
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Add this for password comparison

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body; // Change username to email
    const gymAccount = await GymAccount.findOne({ email }); // Find by email instead of username

    if (!gymAccount) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Add password comparison since GymAccount doesn't have comparePassword method
    const isMatch = await bcrypt.compare(password, gymAccount.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!gymAccount.isApproved) {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const token = jwt.sign({ id: gymAccount._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ 
      token, 
      admin: { 
        id: gymAccount._id, 
        email: gymAccount.email,
        gymName: gymAccount.gymName 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
