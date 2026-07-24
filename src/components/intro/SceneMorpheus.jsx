import { useEffect, useRef, useState } from 'react';
import VideoBackground from './VideoBackground';

const VIDEO_W = 1280;
const VIDEO_H = 720;
const CAPSULES = {
    blue: { fx: 0.326, fy: 0.500 },
    red: { fx: 0.687, fy: 0.562 },
};

function computeCapsuleScreenPct(containerW, containerH) {
    if (!containerW || !containerH) return null;

    const scale = Math.max(containerW / VIDEO_W, containerH / VIDEO_H);
    const renderedW = VIDEO_W * scale;
    const renderedH = VIDEO_H * scale;
    const offsetX = (renderedW - containerW) / 2;
    const offsetY = (renderedH - containerH) / 2;

    const result = {};
    for (const [key, { fx, fy }] of Object.entries(CAPSULES)) {
        const screenX = fx * renderedW - offsetX;
        const screenY = fy * renderedH - offsetY;
        const rawLeft = (screenX / containerW) * 100;
        const rawTop = (screenY / containerH) * 100;

        result[key] = {
            leftPct: Math.min(94, Math.max(6, rawLeft)),
            topPct: Math.min(94, Math.max(6, rawTop)),
        };
    }
    return result;
}

export default function SceneMorpheus({ onPillChoice }) {
    const containerRef = useRef(null);
    const [positions, setPositions] = useState({
        blue: { leftPct: 32.6, topPct: 50.0 },
        red: { leftPct: 68.7, topPct: 56.2 },
    });

    useEffect(() => {
        let animId = null;

        const updatePositions = () => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            const newPos = computeCapsuleScreenPct(clientWidth, clientHeight);
            if (newPos) {
                setPositions(newPos);
            }
        };

        const handleResize = () => {
            if (animId) cancelAnimationFrame(animId);
            animId = requestAnimationFrame(updatePositions);
        };

        updatePositions();

        const observer = new ResizeObserver(handleResize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            if (animId) cancelAnimationFrame(animId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    const getTooltipClass = (leftPct) => {
        if (leftPct < 25) return 'pill-hover-info align-left';
        if (leftPct > 75) return 'pill-hover-info align-right';
        return 'pill-hover-info';
    };

    return (
        <div className="morpheus-scene" ref={containerRef}>
            <VideoBackground
                src="/videos/capsule-choice-bg.mp4"
                poster="/videos/capsule-choice-bg.jpg"
                overlayGradient="linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)"
                loop={false}
            />

            {/* Pill click-targets — positioned dynamically in JS to track cropped video capsules */}
            <div className="pill-container-overlay">
                {/* Left hand (Blue Pill) */}
                <button
                    className="pill-btn"
                    style={{
                        left: `${positions.blue.leftPct}%`,
                        top: `${positions.blue.topPct}%`,
                    }}
                    onClick={() => onPillChoice('blue')}
                >
                    <div className={getTooltipClass(positions.blue.leftPct)}>
                        <span className="pill-label blue">BLUE PILL</span>
                        <span className="pill-desc">Enter the Python Construct</span>
                    </div>
                </button>

                {/* Right hand (Red Pill) */}
                <button
                    className="pill-btn"
                    style={{
                        left: `${positions.red.leftPct}%`,
                        top: `${positions.red.topPct}%`,
                    }}
                    onClick={() => onPillChoice('red')}
                >
                    <div className={getTooltipClass(positions.red.leftPct)}>
                        <span className="pill-label red">RED PILL</span>
                        <span className="pill-desc">See how deep the rabbit hole goes</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
