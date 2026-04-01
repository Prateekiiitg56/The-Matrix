/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void-black': '#000300',      // var(--black) replacing previous void-black
                'surface': '#020f02',         // var(--surface)
                'editor-dark': '#041404',     // var(--card) previously editor-dark
                'raised-dark': '#061806',     // var(--card2) previously raised-dark
                'subtle-line': '#0a3d0a',     // var(--border) previously subtle-line
                'border-focus': '#0f5a0f',    // var(--border2)
                'accent-primary': '#00ff41',  // var(--green) previously accent-primary
                'accent-secondary': '#00cc33',// var(--green2) previously electric violet
                'accent-dim': '#008f11',      // var(--green3)
                'accent-dark': '#003b00',     // var(--green4)
                'easy-diff': '#00ff41',       // var(--easy)
                'med-diff': '#ffe135',        // var(--medium)
                'hard-diff': '#ff3131',       // var(--hard)
                'body-text': '#00ff41',       // Text is all matrix green
                'muted-text': '#1a5c1a',      // var(--muted)
                'text-alt': '#00cc33',        // var(--text2)
                'success-verd': '#00ff41',
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
