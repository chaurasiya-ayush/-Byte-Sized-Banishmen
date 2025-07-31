// Email template for registration verification
export const getRegistrationVerificationTemplate = (
  verificationUrl,
  userEmail
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Byte-Sized Banishment</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #1f2937 0%, #111827 50%, #7c2d12 100%);
                color: #f3f4f6;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #374151;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #4b5563;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 2.5rem;
                font-weight: bold;
                color: #f97316;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            }
            .subtitle {
                color: #9ca3af;
                font-size: 1rem;
                margin-bottom: 20px;
            }
            .welcome-icon {
                font-size: 4rem;
                margin: 20px 0;
            }
            .content {
                line-height: 1.8;
                margin-bottom: 30px;
            }
            .greeting {
                font-size: 1.2rem;
                margin-bottom: 20px;
                color: #f3f4f6;
                text-align: center;
            }
            .message {
                font-size: 1rem;
                color: #d1d5db;
                margin-bottom: 25px;
                text-align: center;
            }
            .verify-button {
                display: inline-block;
                background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 1.1rem;
                text-align: center;
                box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3), 0 4px 6px -2px rgba(249, 115, 22, 0.2);
                transition: all 0.3s ease;
                margin: 20px 0;
            }
            .verify-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 20px -3px rgba(249, 115, 22, 0.4), 0 6px 8px -2px rgba(249, 115, 22, 0.3);
            }
            .benefits {
                background: #451a03;
                border: 1px solid #f97316;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
            }
            .benefits h3 {
                color: #fed7aa;
                margin-bottom: 15px;
                font-size: 1.1rem;
            }
            .benefits ul {
                list-style: none;
                padding: 0;
            }
            .benefits li {
                color: #fdba74;
                margin: 8px 0;
                padding-left: 20px;
                position: relative;
            }
            .benefits li:before {
                content: "🔥";
                position: absolute;
                left: 0;
            }
            .footer {
                text-align: center;
                color: #9ca3af;
                font-size: 0.85rem;
                border-top: 1px solid #4b5563;
                padding-top: 20px;
                margin-top: 30px;
            }
            .footer a {
                color: #f97316;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%);
                margin: 25px 0;
            }
            .link-box {
                background: #1f2937;
                padding: 12px;
                border-radius: 6px;
                word-break: break-all;
                font-family: monospace;
                font-size: 0.9rem;
                border: 1px solid #374151;
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔥 Byte-Sized Banishment</div>
                <div class="subtitle">Welcome to the Coding Arena!</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="content">
                <div class="welcome-icon">🎮</div>
                
                <div class="greeting">
                    Welcome to the Battle, Challenger! 
                </div>
                
                <div class="message">
                    Your account for <strong>${userEmail}</strong> has been created successfully! 
                </div>
                
                <div class="message">
                    To activate your account and begin your coding journey, please verify your email address by clicking the button below:
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" class="verify-button">
                        ⚡ Verify Email & Start Coding
                    </a>
                </div>
                
                <div class="benefits">
                    <h3>🏆 What awaits you:</h3>
                    <ul>
                        <li>Challenge yourself with coding problems</li>
                        <li>Battle against other developers</li>
                        <li>Climb the leaderboards</li>
                        <li>Unlock achievements and badges</li>
                        <li>Track your coding progress</li>
                    </ul>
                </div>
                
                <div class="message">
                    If the button above doesn't work, copy and paste this link into your browser:
                </div>
                
                <div class="link-box">
                    ${verificationUrl}
                </div>
                
                <div style="background: #7c2d12; border: 1px solid #f97316; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 0.9rem; color: #fed7aa;">
                    ⏰ <strong>Important:</strong> This verification link will expire in 24 hours. Please verify your email soon to activate your account.
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent by Byte-Sized Banishment</p>
                <p>If you didn't create this account, please ignore this email.</p>
                <p style="margin-top: 10px;">
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Email template for successful email verification confirmation
export const getEmailVerificationConfirmationTemplate = (userEmail) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Byte-Sized Banishment!</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #1f2937 0%, #111827 50%, #059669 100%);
                color: #f3f4f6;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #374151;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #4b5563;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 2.5rem;
                font-weight: bold;
                color: #10b981;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            }
            .subtitle {
                color: #9ca3af;
                font-size: 1rem;
                margin-bottom: 20px;
            }
            .success-icon {
                font-size: 4rem;
                margin: 20px 0;
            }
            .content {
                line-height: 1.8;
                margin-bottom: 30px;
                text-align: center;
            }
            .message {
                font-size: 1.1rem;
                color: #d1d5db;
                margin-bottom: 25px;
            }
            .login-button {
                display: inline-block;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 1.1rem;
                text-align: center;
                box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.2);
                transition: all 0.3s ease;
                margin: 20px 0;
            }
            .features {
                background: #065f46;
                border: 1px solid #10b981;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
            }
            .features h3 {
                color: #6ee7b7;
                margin-bottom: 15px;
                font-size: 1.1rem;
            }
            .features ul {
                list-style: none;
                padding: 0;
            }
            .features li {
                color: #a7f3d0;
                margin: 8px 0;
                padding-left: 20px;
                position: relative;
            }
            .features li:before {
                content: "🎮";
                position: absolute;
                left: 0;
            }
            .footer {
                text-align: center;
                color: #9ca3af;
                font-size: 0.85rem;
                border-top: 1px solid #4b5563;
                padding-top: 20px;
                margin-top: 30px;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
                margin: 25px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔥 Byte-Sized Banishment</div>
                <div class="subtitle">Welcome to the Arena!</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="content">
                <div class="success-icon">🎉</div>
                
                <div class="message">
                    <strong>Account Activated Successfully!</strong>
                </div>
                
                <div class="message">
                    Welcome to Byte-Sized Banishment, <strong>${userEmail}</strong>! Your account is now fully activated and ready for epic coding battles.
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${
                      process.env.CLIENT_URL || "http://localhost:5173"
                    }" class="login-button">
                        🚀 Enter the Arena
                    </a>
                </div>
                
                <div class="features">
                    <h3>🏆 Your coding journey starts now:</h3>
                    <ul>
                        <li>Solve challenging algorithmic problems</li>
                        <li>Battle other developers in real-time duels</li>
                        <li>Climb global and weekly leaderboards</li>
                        <li>Connect with fellow coding warriors</li>
                        <li>Track your progress and achievements</li>
                        <li>Unlock badges and special rewards</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent by Byte-Sized Banishment</p>
                <p>Your coding adventure awaits!</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Email template for password reset
export const getPasswordResetEmailTemplate = (resetUrl, userEmail) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Byte-Sized Banishment</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #1f2937 0%, #111827 50%, #7f1d1d 100%);
                color: #f3f4f6;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #374151;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #4b5563;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 2.5rem;
                font-weight: bold;
                color: #ef4444;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            }
            .subtitle {
                color: #9ca3af;
                font-size: 1rem;
                margin-bottom: 20px;
            }
            .content {
                line-height: 1.8;
                margin-bottom: 30px;
            }
            .greeting {
                font-size: 1.1rem;
                margin-bottom: 20px;
                color: #f3f4f6;
            }
            .message {
                font-size: 1rem;
                color: #d1d5db;
                margin-bottom: 25px;
            }
            .reset-button {
                display: inline-block;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 1.1rem;
                text-align: center;
                box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -2px rgba(239, 68, 68, 0.2);
                transition: all 0.3s ease;
                margin: 20px 0;
            }
            .reset-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 20px -3px rgba(239, 68, 68, 0.4), 0 6px 8px -2px rgba(239, 68, 68, 0.3);
            }
            .warning {
                background: #451a03;
                border: 1px solid #92400e;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                font-size: 0.9rem;
                color: #fbbf24;
            }
            .footer {
                text-align: center;
                color: #9ca3af;
                font-size: 0.85rem;
                border-top: 1px solid #4b5563;
                padding-top: 20px;
                margin-top: 30px;
            }
            .footer a {
                color: #ef4444;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%);
                margin: 25px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔥 Byte-Sized Banishment</div>
                <div class="subtitle">Password Reset Request</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="content">
                <div class="greeting">
                    Hello, Challenger! 👋
                </div>
                
                <div class="message">
                    We received a request to reset the password for your account associated with <strong>${userEmail}</strong>.
                </div>
                
                <div class="message">
                    Click the button below to reset your password and continue your journey through the coding challenges:
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" class="reset-button">
                        🔑 Reset My Password
                    </a>
                </div>
                
                <div class="warning">
                    ⚠️ <strong>Important Security Information:</strong>
                    <ul style="margin: 10px 0 0 20px;">
                        <li>This link will expire in <strong>1 hour</strong></li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>For security, this link can only be used once</li>
                    </ul>
                </div>
                
                <div class="message">
                    If the button above doesn't work, you can copy and paste this link into your browser:
                </div>
                
                <div style="background: #1f2937; padding: 12px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 0.9rem; border: 1px solid #374151; margin: 15px 0;">
                    ${resetUrl}
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent by Byte-Sized Banishment</p>
                <p>If you have any questions, please contact our support team.</p>
                <p style="margin-top: 10px;">
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Email template for successful password reset confirmation
export const getPasswordResetConfirmationTemplate = (userEmail) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful - Byte-Sized Banishment</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #1f2937 0%, #111827 50%, #059669 100%);
                color: #f3f4f6;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #374151;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #4b5563;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 2.5rem;
                font-weight: bold;
                color: #10b981;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            }
            .subtitle {
                color: #9ca3af;
                font-size: 1rem;
                margin-bottom: 20px;
            }
            .success-icon {
                font-size: 4rem;
                margin: 20px 0;
            }
            .content {
                line-height: 1.8;
                margin-bottom: 30px;
                text-align: center;
            }
            .message {
                font-size: 1.1rem;
                color: #d1d5db;
                margin-bottom: 25px;
            }
            .login-button {
                display: inline-block;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 1.1rem;
                text-align: center;
                box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.2);
                transition: all 0.3s ease;
                margin: 20px 0;
            }
            .security-tip {
                background: #065f46;
                border: 1px solid #10b981;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                font-size: 0.9rem;
                color: #6ee7b7;
            }
            .footer {
                text-align: center;
                color: #9ca3af;
                font-size: 0.85rem;
                border-top: 1px solid #4b5563;
                padding-top: 20px;
                margin-top: 30px;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
                margin: 25px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔥 Byte-Sized Banishment</div>
                <div class="subtitle">Password Reset Successful</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="content">
                <div class="success-icon">✅</div>
                
                <div class="message">
                    <strong>Password Reset Successful!</strong>
                </div>
                
                <div class="message">
                    Your password for <strong>${userEmail}</strong> has been successfully reset.
                </div>
                
                <div class="message">
                    You can now log in with your new password and continue your coding journey!
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${
                      process.env.CLIENT_URL || "http://localhost:5173"
                    }" class="login-button">
                        🚀 Continue to Dashboard
                    </a>
                </div>
                
                <div class="security-tip">
                    🛡️ <strong>Security Tip:</strong> If you didn't make this change, please contact our support team immediately and consider changing your password again.
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent by Byte-Sized Banishment</p>
                <p>Your account security is our priority.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
