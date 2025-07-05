import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // --- NEW FIELDS FOR DASHBOARD ---
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    rank: {
        type: String,
        default: 'Novice'
    },
    correctAnswers: { // Labeled as "Souls Claimed" on frontend
        type: Number,
        default: 0
    },
    dailyStreak: { // Labeled as "Devil's Favor" on frontend
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    // --- END NEW FIELDS ---
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Using timestamps adds createdAt and updatedAt automatically

// Middleware to hash password before saving a new user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
