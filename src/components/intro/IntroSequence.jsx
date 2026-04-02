import { useState, useCallback } from 'react';
import SceneMachineWorld from './SceneMachineWorld';
import SceneMatrixTunnel from './SceneMatrixTunnel';
import SceneMorpheus from './SceneMorpheus';
import './intro.css';

const SCENES = {
    MACHINE: 'machine',
    TUNNEL: 'tunnel',
    MORPHEUS: 'morpheus',
    TRANSITIONING: 'transitioning',
};

export default function IntroSequence({ onIntroComplete }) {
    const [scene, setScene] = useState(SCENES.MACHINE);
    const [transition, setTransition] = useState(null); // 'red' | 'blue' | null
    const [fadeClass, setFadeClass] = useState('scene-fade-enter');

    const goToScene = useCallback((next) => {
        setFadeClass('scene-fade-exit');
        setTimeout(() => {
            setScene(next);
            setFadeClass('scene-fade-enter');
        }, 500);
    }, []);

    const handleMachineComplete = useCallback(() => goToScene(SCENES.TUNNEL), [goToScene]);
    const handleTunnelComplete = useCallback(() => goToScene(SCENES.MORPHEUS), [goToScene]);

    const handlePillChoice = useCallback((pill) => {
        setTransition(pill);
        // Let transition animation play, then launch the app
        setTimeout(() => {
            onIntroComplete(pill);
        }, 1400);
    }, [onIntroComplete]);

    return (
        <div className="intro-overlay">
            {/* Scene content */}
            <div className={fadeClass} style={{ width: '100%', height: '100%' }}>
                {scene === SCENES.MACHINE && (
                    <SceneMachineWorld onComplete={handleMachineComplete} />
                )}
                {scene === SCENES.TUNNEL && (
                    <SceneMatrixTunnel onComplete={handleTunnelComplete} />
                )}
                {scene === SCENES.MORPHEUS && (
                    <SceneMorpheus onPillChoice={handlePillChoice} />
                )}
            </div>

            {/* Pill transition overlays */}
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
