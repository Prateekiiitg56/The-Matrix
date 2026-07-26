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

export default function VideoBackground({
    src,
    poster,
    overlayGradient,
    loop = true,
    playbackRate = 1,
    muted = false,
    seamlessLoop = true,
    crossfadeDuration = 0.6,
}) {
    const video1Ref = useRef(null);
    const video2Ref = useRef(null);
    const activeRef = useRef(1);
    const transitioningRef = useRef(false);

    useEffect(() => {
        const v1 = video1Ref.current;
        const v2 = video2Ref.current;
        if (!v1) return;

        v1.playbackRate = playbackRate;
        if (v2) v2.playbackRate = playbackRate;

        v1.muted = muted;
        if (v2) v2.muted = muted;

        v1.volume = 1;
        if (v2) v2.volume = 1;

        if (!loop || !seamlessLoop) {
            v1.style.opacity = '1';
            if (v2) v2.style.opacity = '0';

            const tryPlaySingle = () => {
                if (muted) {
                    v1.muted = true;
                    v1.play().catch(() => {});
                } else {
                    v1.muted = false;
                    v1.play().catch(() => {
                        v1.muted = true;
                        v1.play().catch(() => {});
                        pendingVideos.add(v1);
                        attachInteractionListener();
                    });
                }
            };

            tryPlaySingle();
            return () => {
                pendingVideos.delete(v1);
                v1.pause();
            };
        }

        let animId = null;

        v1.style.opacity = '1';
        v1.style.transition = 'none';
        if (v2) {
            v2.style.opacity = '0';
            v2.style.transition = 'none';
        }

        activeRef.current = 1;
        transitioningRef.current = false;

        const checkLoop = () => {
            const currentVideo = activeRef.current === 1 ? v1 : v2;
            const nextVideo = activeRef.current === 1 ? v2 : v1;

            if (currentVideo && currentVideo.duration && !isNaN(currentVideo.duration)) {
                const timeLeft = currentVideo.duration - currentVideo.currentTime;

                if (timeLeft <= crossfadeDuration && !transitioningRef.current && nextVideo) {
                    transitioningRef.current = true;

                    nextVideo.currentTime = 0;
                    nextVideo.muted = muted;
                    nextVideo.volume = 0;
                    nextVideo.playbackRate = playbackRate;

                    const playPromise = nextVideo.play();
                    if (playPromise && typeof playPromise.then === 'function') {
                        playPromise.catch(() => {});
                    }

                    const startTime = performance.now();
                    const fadeMs = crossfadeDuration * 1000;

                    const fadeStep = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(1, Math.max(0, elapsed / fadeMs));

                        const currentOpacity = 1 - progress;
                        const nextOpacity = progress;

                        if (activeRef.current === 1) {
                            v1.style.opacity = currentOpacity.toString();
                            v2.style.opacity = nextOpacity.toString();
                        } else {
                            v2.style.opacity = currentOpacity.toString();
                            v1.style.opacity = nextOpacity.toString();
                        }

                        if (!muted) {
                            currentVideo.volume = currentOpacity;
                            nextVideo.volume = nextOpacity;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(fadeStep);
                        } else {
                            currentVideo.pause();
                            currentVideo.currentTime = 0;
                            currentVideo.volume = 1;
                            activeRef.current = activeRef.current === 1 ? 2 : 1;
                            transitioningRef.current = false;
                        }
                    };

                    requestAnimationFrame(fadeStep);
                }
            }

            animId = requestAnimationFrame(checkLoop);
        };

        const tryPlayDual = () => {
            if (muted) {
                v1.muted = true;
                v1.play().catch(() => {});
            } else {
                v1.muted = false;
                v1.play().catch(() => {
                    v1.muted = true;
                    v1.play().catch(() => {});
                    pendingVideos.add(v1);
                    attachInteractionListener();
                });
            }
        };

        tryPlayDual();
        animId = requestAnimationFrame(checkLoop);

        return () => {
            if (animId) cancelAnimationFrame(animId);
            pendingVideos.delete(v1);
            if (v2) pendingVideos.delete(v2);
            if (v1) v1.pause();
            if (v2) v2.pause();
        };
    }, [src, playbackRate, muted, loop, seamlessLoop, crossfadeDuration]);

    return (
        <>
            <video
                ref={video1Ref}
                className="intro-video-bg"
                src={src}
                poster={poster}
                playsInline
                preload="auto"
                style={{ opacity: 1, willChange: 'opacity' }}
            />
            {seamlessLoop && loop && (
                <video
                    ref={video2Ref}
                    className="intro-video-bg"
                    src={src}
                    poster={poster}
                    playsInline
                    preload="auto"
                    style={{ opacity: 0, willChange: 'opacity' }}
                />
            )}
            {overlayGradient && (
                <div
                    className="intro-video-overlay"
                    style={{ background: overlayGradient }}
                />
            )}
        </>
    );
}
