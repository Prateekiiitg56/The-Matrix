const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Problem = require('./models/Problem');
const Progress = require('./models/Progress');
const { executeCodeLocal } = require('./executor');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/latecode')
    .then(() => console.log('🟢 MongoDB MATRIX connected'))
    .catch(err => console.error('🔴 MongoDB connection error:', err));

// --- API ROUTES ---

// 1. Get all problems
app.get('/api/problems', async (req, res) => {
    try {
        const problems = await Problem.find().select('-description -boilerplates -examples -constraints');
        // ^ Send metadata only for the tracking & search view
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problems' });
    }
});

// 2. Get a single problem by ID
app.get('/api/problems/:problemId', async (req, res) => {
    try {
        const problem = await Problem.findOne({ problemId: req.params.problemId });
        if (!problem) return res.status(404).json({ message: 'Problem not found in Matrix Database' });
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problem details' });
    }
});

// 3. Local Execution Route
app.post('/api/execute', executeCodeLocal);

// 4. Progress Tracking Routes (The Construct)
app.get('/api/progress/:userId', async (req, res) => {
    try {
        let progress = await Progress.findOne({ userId: req.params.userId });
        if (!progress) {
            progress = await Progress.create({ userId: req.params.userId });
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress.' });
    }
});

app.post('/api/progress/:userId', async (req, res) => {
    try {
        const { xp, level, completedLessons, currentLesson } = req.body;
        let progress = await Progress.findOne({ userId: req.params.userId });
        if (!progress) {
            progress = new Progress({ userId: req.params.userId });
        }

        // Safely update specific fields
        if (xp !== undefined) progress.xp = xp;
        if (level !== undefined) progress.level = level;
        if (completedLessons) progress.completedLessons = completedLessons;
        if (currentLesson) progress.currentLesson = currentLesson;
        progress.lastActive = new Date();

        await progress.save();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error saving progress.' });
    }
});

// Start the core
app.listen(PORT, () => {
    console.log(`🔌 The Matrix API is running on port ${PORT}`);
});
