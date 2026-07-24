import VideoBackground from './VideoBackground';

export default function SceneMorpheus({ onPillChoice }) {
    return (
        <div className="morpheus-scene">
            <VideoBackground
                src="/videos/capsule-choice-bg.mp4"
                poster="/videos/capsule-choice-bg.jpg"
                overlayGradient="linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)"
                loop={false}
            />

            {/* Pill click-targets — positioned over the video's final frame.
                Left hand = BLUE capsule, Right hand = RED capsule. */}
            <div className="pill-container-overlay">

                {/* Left hand (Blue Pill) — ~32.6% from left, 50% from top */}
                <button className="pill-btn pill-btn-left" onClick={() => onPillChoice('blue')}>
                    <div className="pill-hover-info">
                        <span className="pill-label blue">BLUE PILL</span>
                        <span className="pill-desc">Enter the Python Construct</span>
                    </div>
                </button>

                {/* Right hand (Red Pill) — ~68.7% from left, 56.2% from top */}
                <button className="pill-btn pill-btn-right" onClick={() => onPillChoice('red')}>
                    <div className="pill-hover-info">
                        <span className="pill-label red">RED PILL</span>
                        <span className="pill-desc">See how deep the rabbit hole goes</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
