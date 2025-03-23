const express=require("express");
const app=express();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs'); // Require bcryptjs

const router = express.Router();


//CREATE
router.post("/", async (req, res) => {
    const { name, email, age, password } = req.body; // Get password from request body
    try {
      // Hash the password
      const salt = bcrypt.genSaltSync(10); // Generate a salt
      const hashedPassword = bcrypt.hashSync(password, salt); // Hash password with the salt

      const userAdded = await User.create({
        name: name,
        email: email,
        age: age,
        password: hashedPassword, // Store the hashed password
      });
      res.status(201).json(userAdded);
    } catch (error) {
      console.log(error);
      res.send(400).json({ error: error.message });
    }
  });

// GET
router.get("/", async (req, res) => {
  try {
    const showAll = await User.find();
    res.status(200).json(showAll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
//GET SINGLE USER
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const singleUser = await User.findById({ _id: id });
      res.status(200).json(singleUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//DELETE
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await User.findByIdAndDelete({ _id: id });
      res.status(201).json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


// UPDATE
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body; // Password is not included in update for now
    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// LOGIN ROUTE
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); // Find user by email

        if (!user) {
            return res.status(404).json({ message: "User not found." }); // User not found
        }

        // Compare provided password with hashed password in database
        const isPasswordMatch = bcrypt.compareSync(password, user.password);

        if (isPasswordMatch) {
            // Password matches - Login successful
            res.status(200).json({ message: "Login successful", userId: user._id, email: user.email, name: user.name, age: user.age }); // Send user info back (you can send less in real app)
        } else {
            // Passwords do not match
            res.status(401).json({ message: "Invalid credentials." }); // Unauthorized
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed.", error: error.message }); // Server error
    }
});


module.exports = router;