import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import VideoBackground from './VideoBackground';

const VIDEO_W = 1280;
const VIDEO_H = 720;
const CAPSULES = {
    blue: { fx: 0.326, fy: 0.500 },
    red: { fx: 0.687, fy: 0.562 },
};

function localCoverPosition(containerW, containerH, fx, fy) {
    const scale = Math.max(containerW / VIDEO_W, containerH / VIDEO_H);
    const renderedW = VIDEO_W * scale;
    const renderedH = VIDEO_H * scale;
    const offsetX = (renderedW - containerW) / 2;
    const offsetY = (renderedH - containerH) / 2;
    return {
        x: fx * renderedW - offsetX,
        y: fy * renderedH - offsetY,
    };
}

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
    const blueAnchorRef = useRef(null);
    const redAnchorRef = useRef(null);

    const [anchorCoords, setAnchorCoords] = useState({
        blue: { x: 0, y: 0 },
        red: { x: 0, y: 0 },
    });

    const [positions, setPositions] = useState({
        blue: { leftPct: 32.6, topPct: 50.0 },
        red: { leftPct: 68.7, topPct: 56.2 },
    });

    useEffect(() => {
        let animId = null;

        const updatePositions = () => {
            if (!containerRef.current) return;

            const mediaQuery = window.matchMedia('(max-width: 768px) and (orientation: portrait)');
            const isMobilePortrait = mediaQuery.matches;

            if (isMobilePortrait) {
                const preRotW = window.innerHeight;
                const preRotH = window.innerWidth;

                const blueLocal = localCoverPosition(preRotW, preRotH, CAPSULES.blue.fx, CAPSULES.blue.fy);
                const redLocal = localCoverPosition(preRotW, preRotH, CAPSULES.red.fx, CAPSULES.red.fy);

                setAnchorCoords({
                    blue: blueLocal,
                    red: redLocal,
                });
            } else {
                const { clientWidth, clientHeight } = containerRef.current;
                const newPos = computeCapsuleScreenPct(clientWidth, clientHeight);
                if (newPos) {
                    setPositions(newPos);
                }
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

        const mediaQuery = window.matchMedia('(max-width: 768px) and (orientation: portrait)');
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleResize);
        } else {
            mediaQuery.addListener(handleResize);
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            if (animId) cancelAnimationFrame(animId);
            observer.disconnect();
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleResize);
            } else {
                mediaQuery.removeListener(handleResize);
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    // Measure anchor screen positions on mobile portrait after layout update
    useLayoutEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px) and (orientation: portrait)');
        if (!mediaQuery.matches) return;
        if (!blueAnchorRef.current || !redAnchorRef.current) return;

        const bRect = blueAnchorRef.current.getBoundingClientRect();
        const rRect = redAnchorRef.current.getBoundingClientRect();

        const winW = window.innerWidth;
        const winH = window.innerHeight;
        if (!winW || !winH) return;

        const bX = bRect.left + bRect.width / 2;
        const bY = bRect.top + bRect.height / 2;
        const rX = rRect.left + rRect.width / 2;
        const rY = rRect.top + rRect.height / 2;

        setPositions({
            blue: {
                leftPct: Math.min(94, Math.max(6, (bX / winW) * 100)),
                topPct: Math.min(94, Math.max(6, (bY / winH) * 100)),
            },
            red: {
                leftPct: Math.min(94, Math.max(6, (rX / winW) * 100)),
                topPct: Math.min(94, Math.max(6, (rY / winH) * 100)),
            },
        });
    }, [anchorCoords]);

    const getTooltipClass = (leftPct) => {
        if (leftPct < 25) return 'pill-hover-info align-left';
        if (leftPct > 75) return 'pill-hover-info align-right';
        return 'pill-hover-info';
    };

    return (
        <div className="morpheus-scene" ref={containerRef}>
            <div className="capsule-video-wrap">
                <VideoBackground
                    src="/videos/A_hyperrealistic_cinematic_K.mp4"
                    poster="/videos/capsule-choice-bg.jpg"
                    overlayGradient="linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)"
                    loop={true}
                    muted={false}
                />
                <div
                    ref={blueAnchorRef}
                    className="capsule-anchor"
                    style={{
                        position: 'absolute',
                        left: `${anchorCoords.blue.x}px`,
                        top: `${anchorCoords.blue.y}px`,
                    }}
                />
                <div
                    ref={redAnchorRef}
                    className="capsule-anchor"
                    style={{
                        position: 'absolute',
                        left: `${anchorCoords.red.x}px`,
                        top: `${anchorCoords.red.y}px`,
                    }}
                />
            </div>

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
