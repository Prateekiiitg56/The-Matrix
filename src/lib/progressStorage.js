const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/progress';

export const LEVELS = [
    { level: 1, title: "UNPLUGGED", xpNeeded: 0 },
    { level: 2, title: "AWAKENED", xpNeeded: 200 },
    { level: 3, title: "REDPILL", xpNeeded: 500 },
    { level: 4, title: "OPERATOR", xpNeeded: 1000 },
    { level: 5, title: "HACKER", xpNeeded: 2000 },
    { level: 6, title: "THE ONE", xpNeeded: 4000 }
];

export function getDefaultProgress(userId = 'guest_user') {
    return {
        userId,
        completedLessons: [],
        xp: 0,
        level: 1,
        streak: 0,
        currentLesson: null
    };
}

export function getLocalProgress(userId = 'guest_user') {
    try {
        const stored = localStorage.getItem(`matrix_progress_${userId}`);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to read local progress", e);
    }
    return null;
}

export function saveLocalProgress(userId = 'guest_user', data) {
    try {
        localStorage.setItem(`matrix_progress_${userId}`, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save local progress", e);
    }
}

export async function fetchProgress(userId = 'guest_user') {
    const local = getLocalProgress(userId);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const res = await fetch(`${API_URL}/${userId}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
            const data = await res.json();
            if (data) {
                saveLocalProgress(userId, data);
                return data;
            }
        }
    } catch (e) {
        console.warn("Construct Core API unavailable, falling back to local state.", e);
    }

    return local || getDefaultProgress(userId);
}

export async function updateProgress(userId = 'guest_user', updates) {
    const local = getLocalProgress(userId) || getDefaultProgress(userId);
    const updatedLocal = { ...local, ...updates };

    if (updatedLocal.xp !== undefined) {
        const newLevel = LEVELS.slice().reverse().find(l => updatedLocal.xp >= l.xpNeeded)?.level || 1;
        updatedLocal.level = newLevel;
    }

    saveLocalProgress(userId, updatedLocal);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const res = await fetch(`${API_URL}/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
            const data = await res.json();
            if (data) {
                saveLocalProgress(userId, data);
                return data;
            }
        }
    } catch (e) {
        console.warn("Failed to sync progress to backend, using updated local state.", e);
    }

    return updatedLocal;
}
