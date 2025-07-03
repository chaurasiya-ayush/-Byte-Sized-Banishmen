import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            // If user exists but is not verified, resend verification email
            if (!user.isVerified) {
                // Create a new token
                const verificationToken = crypto.randomBytes(32).toString('hex');
                await new Token({
                    userId: user._id,
                    token: verificationToken
                }).save();
                
                // Send email
                const verificationUrl = `${config.BASE_URL}/api/auth/verify/${user.id}/${verificationToken}`;
                const message = `
                    <h1>Welcome to Byte-Sized Banishment!</h1>
                    <p>You're one step away from battling the Byte-Devil. Please verify your email by clicking the link below:</p>
                    <a href="${verificationUrl}" target="_blank">Verify Your Email</a>
                    <p>This link will expire in 1 hour.</p>`;
                await sendEmail(user.email, 'Verify Your Email', message);

                return res.status(200).json({ message: 'An email has been sent to your account for verification. Please check your inbox.' });
            }
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // 2. If user does not exist, create a new one
        user = new User({ email, password });
        await user.save();

        // 3. Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        await new Token({
            userId: user._id,
            token: verificationToken
        }).save();

        // 4. Send verification email
        const verificationUrl = `${config.BASE_URL}/api/auth/verify/${user.id}/${verificationToken}`;
        const message = `
            <h1>Welcome to Byte-Sized Banishment!</h1>
            <p>You're one step away from battling the Byte-Devil. Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}" target="_blank">Verify Your Email</a>
            <p>This link will expire in 1 hour.</p>`;
        
        await sendEmail(user.email, 'Email Verification', message);

        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify user's email
// @route   GET /api/auth/verify/:userId/:token
// @access  Public
export const verifyEmail = async (req, res) => {
    try {
        // 1. Find user by ID
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send('Invalid link: User not found.');

        // 2. Find token for this user
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        if (!token) return res.status(400).send('Invalid or expired link.');

        // 3. Verify user and delete token
        await User.updateOne({ _id: user._id }, { isVerified: true });
        await Token.findByIdAndDelete(token._id);

        res.status(200).send('<h1>Email Verified Successfully</h1><p>You can now log in to your account.</p>');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
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
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // 2. Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in.' });
        }

        // 3. Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
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
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user.id,
                        email: user.email
                    }
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
