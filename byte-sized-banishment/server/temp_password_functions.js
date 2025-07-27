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
