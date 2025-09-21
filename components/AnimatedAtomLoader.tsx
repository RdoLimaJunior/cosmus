
import React from 'react';
import './AnimatedAtomLoader.css';

const AnimatedAtomLoader: React.FC = () => {
    return (
        <div className="atom-loader">
            <div className="atom-nucleus"></div>
            <div className="atom-orbit">
                <div className="atom-electron"></div>
            </div>
            <div className="atom-orbit">
                <div className="atom-electron"></div>
            </div>
            <div className="atom-orbit">
                <div className="atom-electron"></div>
            </div>
        </div>
    );
};

export default AnimatedAtomLoader;
