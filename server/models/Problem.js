const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
    input: String,
    output: String,
    explanation: String
});

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    problemId: { type: Number, required: true, unique: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    tags: [String],
    description: { type: String, required: true },
    examples: [exampleSchema],
    constraints: [String],
    boilerplates: {
        python: String,
        java: String,
        cpp: String
    },
    status: { type: String, enum: ['solved', 'attempted', 'unsolved'], default: 'unsolved' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
