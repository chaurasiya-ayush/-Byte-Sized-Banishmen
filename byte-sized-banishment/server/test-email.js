import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const testEmailSetup = async () => {
  console.log("🔍 Testing Email Configuration...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log("SERVICE:", process.env.SERVICE || "❌ NOT SET");
  console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT SET");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ SET" : "❌ NOT SET");
  console.log("");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("❌ Missing required email environment variables!");
    console.log("Please set EMAIL_USER and EMAIL_PASS in your .env file");
    return;
  }

  try {
    console.log("🔧 Creating transporter...");

    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("✅ Transporter created successfully");

    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!");

    console.log("📧 Sending test email...");
    const testEmail = {
      from: `Byte-Sized Banishment <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "🔥 Test Email - Byte-Sized Banishment",
      html: `
        <div style="background: #374151; color: white; padding: 20px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #ef4444;">🔥 Email Test Successful!</h2>
          <p>This is a test email from your Byte-Sized Banishment application.</p>
          <p>If you received this email, your email configuration is working correctly! 🎉</p>
          <hr style="border: 1px solid #4b5563; margin: 20px 0;">
          <small style="color: #9ca3af;">
            Sent from your local development environment<br>
            Time: ${new Date().toLocaleString()}
          </small>
        </div>
      `,
    };

    const result = await transporter.sendMail(testEmail);
    console.log("✅ Test email sent successfully!");
    console.log("📧 Message ID:", result.messageId);
  } catch (error) {
    console.log("❌ Email test failed!");
    console.error("Error details:", error.message);

    if (error.message.includes("Invalid login")) {
      console.log("\n💡 Possible solutions:");
      console.log(
        "1. Enable 'Less secure app access' in Gmail (not recommended)"
      );
      console.log("2. Use App Passwords (recommended for Gmail):");
      console.log("   - Go to Google Account settings");
      console.log("   - Security → 2-Step Verification → App passwords");
      console.log("   - Generate an app password for 'Mail'");
      console.log("   - Use that password instead of your regular password");
    }

    if (error.message.includes("EAUTH")) {
      console.log("\n💡 Authentication failed. Check your credentials:");
      console.log("- Make sure EMAIL_USER is your full email address");
      console.log(
        "- Make sure EMAIL_PASS is correct (use app password for Gmail)"
      );
    }
  }
};

// Run the test
testEmailSetup();
