import { useEffect, useState, useMemo } from 'react';
import VideoBackground from './VideoBackground';

/* ── Matrix-glyph character pool ── */
const GLYPHS =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    '0123456789' +
    '!@#$%^&*<>{}[]|/\\~';

function pickRandomGlyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/* ─────────────────────────────────────────────
   DecryptText — "hacking" decode reveal effect
   Each character scrambles through random glyphs
   before locking to its final value, left-to-right.
   ───────────────────────────────────────────── */
function DecryptText({ text, startDelay = 0, charInterval = 60, scrambleDuration = 400, className = '' }) {
    const chars = useMemo(() => text.split(''), [text]);
    const [revealed, setRevealed] = useState(-1);          // index of last locked char
    const [scrambles, setScrambles] = useState(() => chars.map(() => pickRandomGlyph()));

    // Scramble ticker — fast random glyph cycling for unlocked chars
    useEffect(() => {
        const id = setInterval(() => {
            setScrambles(prev =>
                prev.map((_, i) => (i > revealed ? pickRandomGlyph() : prev[i])),
            );
        }, 50);
        return () => clearInterval(id);
    }, [revealed, chars.length]);

    // Progressive lock-in, left to right
    useEffect(() => {
        const timers = chars.map((_, i) =>
            setTimeout(() => setRevealed(i), startDelay + i * charInterval + scrambleDuration),
        );
        return () => timers.forEach(clearTimeout);
    }, [chars, startDelay, charInterval, scrambleDuration]);

    return (
        <span className={`decrypt-text ${className}`} aria-label={text}>
            {chars.map((ch, i) => {
                const isSpace = ch === ' ';
                const locked = i <= revealed;
                return (
                    <span
                        key={i}
                        className={`decrypt-char ${locked ? 'locked' : 'scrambling'}`}
                    >
                        {isSpace ? '\u00A0' : locked ? ch : scrambles[i]}
                    </span>
                );
            })}
        </span>
    );
}

/* ─────────────────────────────────────────────
   SceneMachineWorld — the "loading" intro scene
   ───────────────────────────────────────────── */
export default function SceneMachineWorld({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 6500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const streamTexts = [
        '01001101010011000010101',
        '10110100101001010110100',
        '11001010100110101001010',
        '01010011010110100100101',
    ];

    return (
        <div className="machine-world">
            <VideoBackground
                src="/videos/machine-world-bg.mp4"
                poster="/videos/machine-world-bg.jpg"
                overlayGradient="radial-gradient(ellipse at center bottom, rgba(26,0,0,0.4) 0%, rgba(0,0,0,0.75) 80%)"
            />

            {/* Red text streams on sides */}
            {streamTexts.map((txt, i) => (
                <div
                    key={i}
                    className="machine-text-stream"
                    style={{
                        left: `${8 + i * 25}%`,
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${5 + i}s`,
                    }}
                >
                    {txt}
                </div>
            ))}

            {/* Decrypt-reveal titles over the video */}
            <div className="scene1-title">
                <h1>
                    <DecryptText
                        text="ENTERING THE MATRIX"
                        startDelay={500}
                        charInterval={55}
                        scrambleDuration={350}
                        className="decrypt-headline"
                    />
                </h1>
                <p>
                    <DecryptText
                        text="INITIALIZING MACHINE WORLD PROTOCOL..."
                        startDelay={1600}
                        charInterval={35}
                        scrambleDuration={300}
                        className="decrypt-subline"
                    />
                </p>
            </div>

            {/* Skip */}
            <button className="scene1-skip" onClick={onComplete}>
                SKIP ▶
            </button>
        </div>
    );
}
