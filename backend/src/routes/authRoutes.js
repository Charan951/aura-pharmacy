import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

const createToken = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const payload = {
    sub: user.id,
    role: user.role,
  };

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "user",
    });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
      },
    });
  } catch {
    return res.status(500).json({ message: "Failed to login" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send the email
    try {
      await sendEmail({
        to: user.email,
        subject: "MediCare Pharmacy - Password Reset Code",
        text: `Your password reset code is: ${otp}. It is valid for 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
            <h2 style="color: #6366f1; text-align: center;">MediCare Password Reset</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password. Use the verification code below to set a new password:</p>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; margin: 20px 0; color: #1f2937;">
              ${otp}
            </div>
            <p>This code is valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated email from MediCare Pharmacy.</p>
          </div>
        `,
      });

      return res.json({ message: "Reset code sent to email successfully" });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      return res.status(500).json({ message: "Failed to send reset code email. Please check SMTP settings." });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "An error occurred while processing forgot password request" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, reset code (OTP) and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Failed to reset password" });
  }
});

router.put("/profile", authenticate, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered by another user" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone || "";
    await user.save();

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

router.post("/addresses", authenticate, async (req, res) => {
  try {
    const { type, line1, city, state, postalCode, coordinates } = req.body;

    if (!line1 || !city || !state || !postalCode) {
      return res.status(400).json({ message: "Address fields are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFirstAddress = !user.addresses || user.addresses.length === 0;

    user.addresses.push({
      type: type || "home",
      line1,
      city,
      state,
      postalCode,
      coordinates,
      isDefault: isFirstAddress, // Make default if it's the first one
    });

    await user.save();
    return res.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({ message: "Failed to add address" });
  }
});

router.put("/addresses/:id/default", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressId = req.params.id;
    let found = false;

    user.addresses.forEach((addr) => {
      if (addr._id.toString() === addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) return res.status(404).json({ message: "Address not found" });

    await user.save();
    return res.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Set default address error:", error);
    return res.status(500).json({ message: "Failed to set default address" });
  }
});

router.delete("/addresses/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressId = req.params.id;
    const initialLength = user.addresses.length;
    
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);

    if (user.addresses.length === initialLength) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If the deleted address was default, make the first one default
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return res.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({ message: "Failed to delete address" });
  }
});

export default router;
