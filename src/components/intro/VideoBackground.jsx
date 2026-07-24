import { useEffect, useRef } from 'react';

/**
 * Shared video background with unmuted-autoplay-with-fallback logic.
 *
 * Strategy:
 *  1. Try play() unmuted.
 *  2. If the browser blocks it (autoplay policy), fall back to muted playback
 *     immediately so the visual isn't stuck, and attach a one-time listener
 *     for the first user interaction (click/touchstart/keydown) that unmutes
 *     and re-plays any active intro videos.
 */

const INTERACTION_EVENTS = ['click', 'touchstart', 'keydown'];

// Module-level set so the one-time interaction listener is shared across
// all VideoBackground instances (only one listener needed for the page).
let pendingVideos = new Set();
let listenerAttached = false;

function attachInteractionListener() {
    if (listenerAttached) return;
    listenerAttached = true;

    const handler = () => {
        // Unmute and resume all pending videos
        pendingVideos.forEach((video) => {
            if (video && !video.paused) {
                video.muted = false;
            } else if (video) {
                video.muted = false;
                video.play().catch(() => {});
            }
        });
        pendingVideos.clear();

        // Remove ourselves — one-shot
        INTERACTION_EVENTS.forEach((evt) =>
            document.removeEventListener(evt, handler, { capture: true }),
        );
        listenerAttached = false;
    };

    INTERACTION_EVENTS.forEach((evt) =>
        document.addEventListener(evt, handler, { capture: true, once: false }),
    );
}

export default function VideoBackground({ src, poster, overlayGradient, loop = true, loopStart = null, playbackRate = 1 }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Apply playback speed
        video.playbackRate = playbackRate;

        const applySpeed = () => {
            if (video) video.playbackRate = playbackRate;
        };

        video.addEventListener('play', applySpeed);
        video.addEventListener('loadedmetadata', applySpeed);

        const handleTimeUpdate = () => {
            if (!video || !video.duration || loopStart === null || loopStart === undefined) return;
            if (video.currentTime >= video.duration - 0.05) {
                video.currentTime = loopStart;
                video.play().catch(() => {});
            }
        };

        if (loopStart !== null && loopStart !== undefined) {
            video.addEventListener('timeupdate', handleTimeUpdate);
        }

        // Check user's preferred motion setting
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const tryPlayUnmuted = () => {
            video.muted = false;
            video.playbackRate = playbackRate;
            const playPromise = video.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(() => {
                    // Unmuted autoplay blocked — fall back to muted
                    video.muted = true;
                    video.playbackRate = playbackRate;
                    video.play().catch(() => {});
                    // Register for unmuting on first user interaction
                    pendingVideos.add(video);
                    attachInteractionListener();
                });
            }
        };

        const handleMotionPreference = (e) => {
            if (e.matches) {
                video.pause();
                video.currentTime = 0;
            } else {
                tryPlayUnmuted();
            }
        };

        // Initial check
        if (mediaQuery.matches) {
            video.pause();
            video.currentTime = 0;
        } else {
            tryPlayUnmuted();
        }

        // Listener for dynamic OS preference changes
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleMotionPreference);
        } else {
            mediaQuery.addListener(handleMotionPreference);
        }

        return () => {
            pendingVideos.delete(video);
            video.removeEventListener('play', applySpeed);
            video.removeEventListener('loadedmetadata', applySpeed);
            if (loopStart !== null && loopStart !== undefined) {
                video.removeEventListener('timeupdate', handleTimeUpdate);
            }
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleMotionPreference);
            } else {
                mediaQuery.removeListener(handleMotionPreference);
            }
        };
    }, [src, playbackRate, loopStart]);

    const isNativeLoop = loop && (loopStart === null || loopStart === undefined);

    return (
        <>
            <video
                ref={videoRef}
                className="intro-video-bg"
                src={src}
                poster={poster}
                autoPlay
                loop={isNativeLoop}
                playsInline
                preload="auto"
            />
            {overlayGradient && (
                <div
                    className="intro-video-overlay"
                    style={{ background: overlayGradient }}
                />
            )}
        </>
    );
}
