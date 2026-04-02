# The Matrix

The Matrix is a dual-environment educational platform designed to gamify and structure software engineering learning. Inspired by the architectural and visual themes of "The Matrix," the platform forces users to make a choice upon initialization, branching into two entirely distinct learning operating systems.

## Dual-World Architecture

Upon entering Latecode, users undergo a cinematic initialization sequence ending in the iconic choice between the Red Pill and the Blue Pill. The choice permanently alters the environment variables and the user's trajectory.

### Path 1: The Matrix (Red Pill)
Selecting the Red Pill launches the Matrix DSA Tracker. This is a brutalist, neon-green terminal environment focused on mastering Data Structures and Algorithms.

Features of the Matrix Tracker:
- **Comprehensive Problem Database:** A MongoDB-backed repository of Leetcode-style algorithmic problems, classified by data structure (Arrays, Trees, Graphs, Dynamic Programming, etc.).
- **Progress Analytics:** Real-time tracking of completion rates across different difficulty tiers (Easy, Medium, Hard).
- **Streak Mechanisms:** Daily activity trackers designed to enforce consistency and discipline in coding practice.
- **Search and Filtering:** High-speed querying capabilities to locate specific algorithm patterns or problem types within the archive.
- **Aesthetic:** Dark void backgrounds, toxic green text, CRT scanline effects, and cascading code visuals.

### Path 2: The Construct (Blue Pill)
Selecting the Blue Pill launches The Construct OS. This is a cerebral, electric-blue simulation environment designed as a zero-to-pro interactive Python curriculum.

Features of the Construct OS:
- **Integrated Browser Execution (WASM):** Complete bypassing of backend execution latency via Pyodide. Python code compiles and runs entirely within the client's browser through WebAssembly.
- **Monaco Engine:** Professional-grade IDE integration using the Monaco Editor (the same engine powering VS Code) directly in the browser.
- **Curriculum Tree:** A massive 7-module JSON-driven curriculum guiding users from "Hello World" down to advanced Object-Oriented Programming and System Architecture.
- **Phased Learning Loops:** Each module consists of Markdown-rendered Theory panels, interactive Task workbenches with automated test assertions, and Multiple-Choice Quizzes.
- **Gamified Progression:** As users pass WASM-executed tests and quizzes, they accumulate Experience Points (XP) and ascend through ranks (e.g., Unplugged, Awakened, Hacker, The One).
- **Aesthetic:** Deep midnight navy backgrounds, electric blue glassmorphism panels, sharp geometric borders, and a surgical "digital void" sensory experience.

## Technology Stack

**Frontend Framework:** React.js powered by Vite for high-speed hot-module replacement and optimized builds.
**Styling:** Tailwind CSS combined with dynamic CSS variables to handle the massive contextual theme shifts between the Green and Blue worlds.
**Backend Server:** Node.js and Express.js providing lightweight, high-performance REST APIs.
**Database:** MongoDB via Mongoose for persistent tracking of problem metadata, user progress, and system statistics.
**Execution Engine:** WebAssembly (WASM) Pyodide runtime to execute arbitrary Python logic within the client sandbox safely.

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally or a valid MongoDB Atlas URI

### Initialization Steps

1. Clone the repository and navigate into the root directory.
2. Install frontend dependencies:
   npm install

3. Open a second terminal window, navigate to the `server` directory, and install backend dependencies:
   cd server
   npm install

4. Configure your environment. You may need to specify your MongoDB connection string inside the `server.js` or an `.env` file depending on your local machine setup.

5. Start the backend infrastructure:
   cd server
   node server.js

6. Start the frontend client (in your original terminal window):
   npm run dev

The system will now be accessible on your local port. Follow the initialization sequence and make your choice.
