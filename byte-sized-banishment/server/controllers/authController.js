import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import PasswordResetToken from "../models/passwordResetTokenModel.js";
import sendEmail from "../utils/sendEmail.js";
import {
  getPasswordResetEmailTemplate,
  getPasswordResetConfirmationTemplate,
  getRegistrationVerificationTemplate,
  getEmailVerificationConfirmationTemplate,
} from "../utils/emailTemplates.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import bcrypt from "bcryptjs";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  // Destructure username from the request body
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ message: "This username is already taken." });
    }

    // Create a new user with the username
    const user = new User({ username, email, password });
    await user.save();

    // --- The rest of the function (token generation, email sending) remains the same ---
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await new Token({
      userId: user._id,
      token: verificationToken,
    }).save();

    const verificationUrl = `${config.BASE_URL}/api/auth/verify/${user.id}/${verificationToken}`;
    const emailTemplate = getRegistrationVerificationTemplate(
      verificationUrl,
      user.email
    );

    await sendEmail(
      user.email,
      "Welcome to Byte-Sized Banishment - Verify Your Email",
      emailTemplate
    );

    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Verify user's email
// @route   GET /api/auth/verify/:userId/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    // 1. Find user by ID
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.redirect(
        `${
          config.CLIENT_URL || "http://localhost:5173"
        }/verification-error?error=user-not-found`
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.redirect(
        `${
          config.CLIENT_URL || "http://localhost:5173"
        }/verification-error?error=already-verified`
      );
    }

    // 2. Find token for this user
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.redirect(
        `${
          config.CLIENT_URL || "http://localhost:5173"
        }/verification-error?error=invalid-token`
      );
    }

    // 3. Verify user and delete token
    await User.updateOne({ _id: user._id }, { isVerified: true });
    await Token.findByIdAndDelete(token._id);

    // Send welcome confirmation email
    try {
      const welcomeTemplate = getEmailVerificationConfirmationTemplate(
        user.email
      );
      await sendEmail(
        user.email,
        "Welcome to Byte-Sized Banishment - Let's Code!",
        welcomeTemplate
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the verification if email sending fails
    }

    // Redirect to success page
    res.redirect(
      `${config.CLIENT_URL || "http://localhost:5173"}/verification-success`
    );
  } catch (error) {
    console.error("Email verification error:", error);
    res.redirect(
      `${
        config.CLIENT_URL || "http://localhost:5173"
      }/verification-error?error=server-error`
    );
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 2. Check if user is verified
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });
    }

    // 3. Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 4. Create and sign a JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Add these functions to the end of authController.js

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email address first",
      });
    }

    // Delete any existing password reset tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Create new password reset token
    const passwordResetToken = new PasswordResetToken({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await passwordResetToken.save();

    // Create reset URL
    const resetUrl = `${config.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email with reset link
    const emailTemplate = getPasswordResetEmailTemplate(resetUrl, email);
    await sendEmail(
      email,
      "🔑 Password Reset - Byte-Sized Banishment",
      emailTemplate
    );

    res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send password reset email",
    });
  }
};

// @desc    Verify password reset token
// @route   GET /api/auth/verify-reset-token/:token
// @access  Public
export const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the password reset token
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return res.json({
        valid: false,
        message: "Invalid or expired reset token",
      });
    }

    // Check if user still exists
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.json({
        valid: false,
        message: "User account no longer exists",
      });
    }

    res.json({
      valid: true,
      message: "Reset token is valid",
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    res.json({
      valid: false,
      message: "Invalid or expired reset token",
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find the password reset token
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Find the user
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account no longer exists",
      });
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Mark the reset token as used
    resetToken.used = true;
    await resetToken.save();

    // Delete all password reset tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Send confirmation email
    const confirmationTemplate = getPasswordResetConfirmationTemplate(
      user.email
    );
    await sendEmail(
      user.email,
      "✅ Password Reset Successful - Byte-Sized Banishment",
      confirmationTemplate
    );

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};
