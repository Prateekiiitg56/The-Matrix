import { useState } from 'react';

export default function SceneMorpheus({ onPillChoice }) {
    return (
        <div className="morpheus-scene">
            {/* Real Hand Background Image */}
            <div className="morpheus-hands-bg" style={{ backgroundImage: "url('/hand.png')" }} />

            {/* Absolutely Positioned Interactive CSS Pills over the palms */}
            <div className="pill-container-overlay">

                {/* Left hand (Red Pill) */}
                <button className="pill-btn pill-btn-left" onClick={() => onPillChoice('red')}>
                    <div className="pill-capsule pill-red" />
                    <div className="pill-hover-info">
                        <span className="pill-label red">RED PILL</span>
                        <span className="pill-desc">See how deep the rabbit hole goes</span>
                    </div>
                </button>

                {/* Right hand (Blue Pill) */}
                <button className="pill-btn pill-btn-right" onClick={() => onPillChoice('blue')}>
                    <div className="pill-capsule pill-blue" />
                    <div className="pill-hover-info">
                        <span className="pill-label blue">BLUE PILL</span>
                        <span className="pill-desc">Enter the Python Construct</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
