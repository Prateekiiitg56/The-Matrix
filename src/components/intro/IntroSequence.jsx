import { useState, useCallback } from 'react';
import SceneMachineWorld from './SceneMachineWorld';
import SceneMorpheus from './SceneMorpheus';
import './intro.css';

const SCENES = {
    MACHINE: 'machine',
    MORPHEUS: 'morpheus',
};

export default function IntroSequence({ onIntroComplete }) {
    const [scene, setScene] = useState(SCENES.MACHINE);
    const [isTransitioningScene, setIsTransitioningScene] = useState(false);
    const [transition, setTransition] = useState(null); // 'red' | 'blue' | null

    const goToScene = useCallback((next) => {
        if (isTransitioningScene) return;
        setIsTransitioningScene(true);

        setTimeout(() => {
            setScene(next);
            setIsTransitioningScene(false);
        }, 850);
    }, [isTransitioningScene]);

    const handleMachineComplete = useCallback(() => goToScene(SCENES.MORPHEUS), [goToScene]);

    const handlePillChoice = useCallback((pill) => {
        setTransition(pill);
        setTimeout(() => {
            onIntroComplete(pill);
        }, 1400);
    }, [onIntroComplete]);

    return (
        <div className="intro-overlay">
            <div className="scene-container">
                {/* Scene 1: Machine World */}
                {(scene === SCENES.MACHINE || isTransitioningScene) && (
                    <div className={`scene-layer ${isTransitioningScene ? 'scene-layer--exit' : 'scene-layer--active'}`}>
                        <SceneMachineWorld onComplete={handleMachineComplete} />
                    </div>
                )}

                {/* Scene 2: Morpheus Capsule Choice */}
                {(scene === SCENES.MORPHEUS || isTransitioningScene) && (
                    <div className={`scene-layer ${isTransitioningScene ? 'scene-layer--enter-morpheus' : 'scene-layer--active'}`}>
                        <SceneMorpheus onPillChoice={handlePillChoice} />
                    </div>
                )}
            </div>

            {/* Matrix Scanline & Glitch Flash Transition Overlay */}
            {isTransitioningScene && (
                <div className="scene-glitch-overlay">
                    <div className="glitch-line-stream" />
                    <div className="glitch-flash-pulse" />
                </div>
            )}

            {/* Pill choice final transition overlays */}
            {transition === 'red' && (
                <>
                    <div className="red-pill-transition" />
                    <div className="matrix-enter-flash" style={{ animationDelay: '0.6s' }} />
                </>
            )}
            {transition === 'blue' && (
                <div className="blue-pill-transition" />
            )}
        </div>
    );
}
