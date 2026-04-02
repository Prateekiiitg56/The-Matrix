const API_URL = 'http://localhost:5000/api/progress';

export const LEVELS = [
    { level: 1, title: "UNPLUGGED", xpNeeded: 0 },
    { level: 2, title: "AWAKENED", xpNeeded: 200 },
    { level: 3, title: "REDPILL", xpNeeded: 500 },
    { level: 4, title: "OPERATOR", xpNeeded: 1000 },
    { level: 5, title: "HACKER", xpNeeded: 2000 },
    { level: 6, title: "THE ONE", xpNeeded: 4000 }
];

export async function fetchProgress(userId = 'guest_user') {
    try {
        const res = await fetch(`${API_URL}/${userId}`);
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("Failed to fetch progress from Construct Core", e);
    }
    // Fallback default
    return {
        userId,
        completedLessons: [],
        xp: 0,
        level: 1,
        streak: 0,
        currentLesson: null
    };
}

export async function updateProgress(userId = 'guest_user', updates) {
    try {
        // Check if XP crossed a level threshold
        if (updates.xp !== undefined) {
            const newLevel = LEVELS.slice().reverse().find(l => updates.xp >= l.xpNeeded)?.level || 1;
            updates.level = newLevel;
        }

        const res = await fetch(`${API_URL}/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("Failed to update progress to Construct Core", e);
    }
}
