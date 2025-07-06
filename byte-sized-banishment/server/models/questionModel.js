import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        index: true, // Index for faster queries on subject
    },
    prompt: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['mcq', 'code', 'integer', 'description'], // The types of questions we support
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
        index: true, // Index for faster queries on difficulty
    },
    // For MCQ questions
    options: [{
        text: String,
    }],
    // For Code and Integer questions
    correctAnswer: {
        type: String, // Can store the correct option index for MCQ, the integer, or a reference to test cases for code
    },
    // For Code questions
    testCases: [{
        input: String,
        output: String,
    }],
    subTopic: { // e.g., "Recursion", "Arrays", "SQL Joins"
        type: String,
    }
});

// To add some sample questions to your database for testing, you can use a script
// or connect to your DB with MongoDB Compass and insert them manually.

const Question = mongoose.model('Question', questionSchema);
export default Question;