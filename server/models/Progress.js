const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // 'guest' until auth is fully hooked
    completedLessons: { type: [String], default: [] },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    currentLesson: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
