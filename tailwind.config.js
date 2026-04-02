/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void-black': 'var(--theme-void-black)',
                'surface': 'var(--theme-surface)',
                'editor-dark': 'var(--theme-editor-dark)',
                'raised-dark': 'var(--theme-raised-dark)',
                'subtle-line': 'var(--theme-subtle-line)',
                'border-focus': 'var(--theme-border-focus)',
                'accent-primary': 'var(--theme-accent-primary)',
                'accent-secondary': 'var(--theme-accent-secondary)',
                'accent-dim': 'var(--theme-accent-dim)',
                'accent-dark': 'var(--theme-accent-dark)',
                'easy-diff': '#00ff41',
                'med-diff': '#ffe135',
                'hard-diff': '#ff3131',
                'body-text': 'var(--theme-accent-primary)',
                'muted-text': 'var(--theme-muted-text)',
                'text-alt': 'var(--theme-accent-secondary)',
                'success-verd': 'var(--theme-accent-primary)',
                'fail-verd': '#ff3131'
            },
            fontFamily: {
                ui: ['"Share Tech Mono"', 'monospace'],      // Body font
                code: ['"Share Tech Mono"', 'monospace'],    // Code font
                display: ['"Orbitron"', 'sans-serif'],       // Headers
                vt: ['"VT323"', 'monospace']                 // Terminal look
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(0,255,65,0.15)',
                'glow': '0 0 20px rgba(0,255,65,0.3)',
                'glow-lg': '0 0 40px rgba(0,255,65,0.5)',
            }
        },
    },
    plugins: [],
}
